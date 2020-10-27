CREATE OR REPLACE PACKAGE pkg_apps_link
  IS
  --*****************************************************************
  -------------------------------------------------------------------
  --*****************************************************************
  -- Creator           : Abdulla Al Mamun
  -- Designation       : TO
  -- Creation Date     : 20/09/2020
  -- Purpose           : MIS Schedule
  -- Modification Date :
  
  --------------------------------------------------------------------------------------------
  --************************  Procedure DEFINITION ********************************************
  --------------------------------------------------------------------------------------------
  PROCEDURE fsp_addup_link
            (
              puser_flag           IN sebl_app_link.user_flag%TYPE
            , plink_title          IN sebl_app_link.link_title%TYPE
            , pcatg_id             IN sebl_app_link.catg_id%TYPE
            , plink_url            IN sebl_app_link.link_url%TYPE
            , plink_img_url        IN sebl_app_link.link_img_url%TYPE
            , pmake_by             IN sebl_app_link.make_by%TYPE
            , perrormsg            OUT varchar2

            );

  -------------------------------------------------------------------------------------------
  PROCEDURE fsp_get_all_link
            (
              puser_flag      IN sebl_app_link.user_flag%TYPE DEFAULT NULL
            , pip_address      IN sebl_app_fav_link.ip_address%TYPE  
            , presults        OUT SYS_REFCURSOR

            );

  -------------------------------------------------------------------------------------------
  PROCEDURE fsp_set_fav_link
            (
              pip_address      IN sebl_app_fav_link.ip_address%TYPE
            , plink_id         IN sebl_app_fav_link.link_id%Type
            , perrormsg       OUT varchar2

            );

  -------------------------------------------------------------------------------------------
  PROCEDURE fsp_set_link_log
            (
              pip_address      IN sebl_app_fav_link.ip_address%TYPE
            , plink_id         IN sebl_app_fav_link.link_id%Type
            , perrormsg       OUT varchar2

            );

  -------------------------------------------------------------------------------------------
  PROCEDURE rsp_get_fav_link
            (
              pip_address      IN sebl_app_fav_link.ip_address%TYPE
            , presults        OUT SYS_REFCURSOR

            );

  -------------------------------------------------------------------------------------------
  PROCEDURE rsp_get_link_log
            (
              pip_address      IN sebl_app_fav_link.ip_address%TYPE
            , presults        OUT SYS_REFCURSOR

            );

  -------------------------------------------------------------------------------------------
  PROCEDURE fsp_set_link_catg
            (
              pcatg_name       IN sebl_link_catg.catg_name%TYPE
            , pmake_by         IN sebl_link_catg.make_by%Type
            , perrormsg       OUT varchar2

            );

  -------------------------------------------------------------------------------------------
  PROCEDURE rsp_get_link_catg
            (
               presults        OUT SYS_REFCURSOR

            );

  -------------------------------------------------------------------------------------------
END pkg_apps_link;
/
CREATE OR REPLACE PACKAGE BODY pkg_apps_link
  IS

  -------------------------------------------------------------------------------------------
  PROCEDURE fsp_addup_link
            (
              puser_flag           IN sebl_app_link.user_flag%TYPE
            , plink_title          IN sebl_app_link.link_title%TYPE
            , pcatg_id             IN sebl_app_link.catg_id%TYPE
            , plink_url            IN sebl_app_link.link_url%TYPE
            , plink_img_url        IN sebl_app_link.link_img_url%TYPE
            , pmake_by             IN sebl_app_link.make_by%TYPE
            , perrormsg            OUT varchar2

            )
   IS 
   v_max_linkId             INTEGER:=0;
   v_count                  INTEGER:=0;
   BEGIN
    
     SELECT MAX(t.link_id)
       INTO v_max_linkId
       FROM sebl_app_link t;
     v_max_linkId := v_max_linkId+1;
     
     SELECT COUNT(1)
       INTO v_count
       FROM sebl_app_link t
      WHERE t.link_url=plink_url;
     IF v_count>0 THEN
       UPDATE sebl_app_link t
          SET t.link_title    = plink_title
            , t.catg_id       = pcatg_id
            , t.user_flag     = puser_flag
            , t.link_img_url  = plink_img_url
            , t.make_date     = SYSDATE
       WHERE t.link_url = plink_url;   
     ELSE
       INSERT INTO sebl_app_link
                  ( link_id
                  , link_title
                  , catg_id
                  , link_url
                  , user_flag
                  , make_by
                  , make_date
                  , link_img_url
                  , status
                  )
                VALUES
                  ( v_max_linkId
                  , plink_title
                  , pcatg_id
                  , plink_url
                  , puser_flag
                  , pmake_by
                  , SYSDATE
                  , plink_img_url
                  , 1
                  );
                
     END IF;
 
      COMMIT;
      
      EXCEPTION
        WHEN OTHERS THEN
            perrormsg := SQLERRM;
            
   END fsp_addup_link;        

  -------------------------------------------------------------------------------------------
  PROCEDURE fsp_get_all_link
            (
              puser_flag      IN sebl_app_link.user_flag%TYPE DEFAULT NULL
            , pip_address      IN sebl_app_fav_link.ip_address%TYPE 
            , presults        OUT SYS_REFCURSOR

            )
  IS
  BEGIN
    OPEN presults FOR
      SELECT l.link_id
           , l.link_title
           , l.link_url
           , l.link_img_url
           , l.user_flag
           , c.catg_id
           , c.catg_name
           , (CASE WHEN f.link_id IS NULL THEN 0 ELSE 1 END) is_fav
           , COUNT(1) OVER (PARTITION BY l.catg_id) AS my_rank
        FROM sebl_app_link l
       INNER JOIN sebl_link_catg c
          ON l.catg_id = c.catg_id
        LEFT JOIN (SELECT f.* 
                    FROM (SELECT f.ip_address
                      , f.link_id
                      , f.make_dt
                      , RANK() OVER (ORDER BY f.make_dt DESC) AS recent_fav
                   FROM sebl_app_fav_link f
                   WHERE f.status=1
                     AND f.ip_address=pip_address
                   )f
                   WHERE recent_fav <=10
                  ) f
          ON l.link_id = f.link_id
       WHERE (l.user_flag = puser_flag OR l.user_flag= 2 OR  puser_flag IS NULL)
         AND l.status=1
       ORDER BY my_rank DESC;
  END fsp_get_all_link;
  -------------------------------------------------------------------------------------------
  PROCEDURE fsp_set_fav_link
            (
              pip_address      IN sebl_app_fav_link.ip_address%TYPE
            , plink_id         IN sebl_app_fav_link.link_id%Type
            , perrormsg       OUT varchar2

            )
   IS
      v_count                PLS_INTEGER := 0;
      v_status                PLS_INTEGER := 0;
   BEGIN
     
     SELECT COUNT(1)
        INTO v_count
        FROM sebl_app_fav_link f
       WHERE f.ip_address = pip_address
         AND f.link_id    = plink_id;
         
     SELECT MAX(f.status)
        INTO v_status
        FROM sebl_app_fav_link f
       WHERE f.ip_address = pip_address
         AND f.link_id    = plink_id;
         
     IF v_count>0 THEN
       IF v_status >0 THEN
          v_status:=0;
       ELSE
         v_status:=1;
       END IF;
       
       UPDATE sebl_app_fav_link f
        SET f.status=v_status,
            f.make_dt=SYSDATE
      WHERE f.ip_address = pip_address
        AND f.link_id = plink_id;
     ELSE
          INSERT INTO sebl_app_fav_link
               ( ip_address
               , link_id
               )
              VALUES
                ( pip_address
                , plink_id
                );
     
     END IF;
     COMMIT;
      EXCEPTION
        WHEN OTHERS THEN
            perrormsg := SQLERRM;
   END fsp_set_fav_link;

  -------------------------------------------------------------------------------------------
  PROCEDURE fsp_set_link_log
            (
              pip_address      IN sebl_app_fav_link.ip_address%TYPE
            , plink_id         IN sebl_app_fav_link.link_id%Type
            , perrormsg       OUT varchar2

            )
   IS
      v_count                PLS_INTEGER := 0;
   BEGIN
     
     SELECT COUNT(1)
        INTO v_count
        FROM sebl_app_link_log f
       WHERE f.ip_address = pip_address
         AND f.link_id    = plink_id;
         
     IF v_count>0 THEN
       
       UPDATE sebl_app_link_log f
        SET f.access_dt = SYSDATE
      WHERE f.ip_address = pip_address
        AND f.link_id = plink_id;
     ELSE
          INSERT INTO sebl_app_link_log
               ( ip_address
               , link_id
               )
              VALUES
                ( pip_address
                , plink_id
                );
     
     END IF;
     COMMIT;
      EXCEPTION
        WHEN OTHERS THEN
            perrormsg := SQLERRM;
   END fsp_set_link_log;

  -------------------------------------------------------------------------------------------
  
  PROCEDURE rsp_get_fav_link
            (
              pip_address      IN sebl_app_fav_link.ip_address%TYPE
            , presults        OUT SYS_REFCURSOR

            )
  IS
  BEGIN
     OPEN presults FOR
      SELECT l.*
        FROM (
              SELECT l.link_id
                   , l.link_title
                   , l.link_url
                   , l.catg_id
                   , l.link_img_url
                   , f.make_dt
                   , RANK() OVER (ORDER BY f.make_dt DESC) AS recent_fav
                FROM sebl_app_link l
               INNER JOIN sebl_app_fav_link f
                  ON l.link_id = f.link_id
               WHERE f.ip_address=pip_address
                 AND l.status=1
                 AND f.status=1
               ) l
         WHERE l.recent_fav <= 10;     
               
         
   /* EXCEPTION
        WHEN OTHERS THEN
            perrormsg := SQLERRM;*/
   
  END rsp_get_fav_link;

  -------------------------------------------------------------------------------------------
  
  PROCEDURE rsp_get_link_log
            (
              pip_address      IN sebl_app_fav_link.ip_address%TYPE
            , presults        OUT SYS_REFCURSOR

            )
  IS
  BEGIN
     OPEN presults FOR
      SELECT l.*
        FROM (
              SELECT l.link_id
                   , l.link_title
                   , l.link_url
                   , l.catg_id
                   , l.link_img_url
                   , f.access_dt
                   , RANK() OVER (ORDER BY f.access_dt DESC) AS recent_fav
                FROM sebl_app_link l
               INNER JOIN sebl_app_link_log f
                  ON l.link_id = f.link_id
               WHERE f.ip_address=pip_address
                 AND l.status=1
               ) l
         WHERE l.recent_fav <= 10;     
               
         
   /* EXCEPTION
        WHEN OTHERS THEN
            perrormsg := SQLERRM;*/
   
  END rsp_get_link_log;

  -------------------------------------------------------------------------------------------
  PROCEDURE fsp_set_link_catg
            (
              pcatg_name       IN sebl_link_catg.catg_name%TYPE
            , pmake_by         IN sebl_link_catg.make_by%Type
            , perrormsg       OUT varchar2

            )
  IS
   v_max_catg_id             INTEGER:=0;
  BEGIN
    SELECT MAX(t.catg_id)
       INTO v_max_catg_id
       FROM sebl_link_catg t;
       
     v_max_catg_id := v_max_catg_id+1;
     INSERT INTO sebl_link_catg
       (catg_id, catg_name, make_by, make_dt)
     VALUES
       (v_max_catg_id, pcatg_name, pmake_by, SYSDATE);
     
     COMMIT;
      
      EXCEPTION
        WHEN OTHERS THEN
            perrormsg := SQLERRM;
  END fsp_set_link_catg;
  -------------------------------------------------------------------------------------------
  PROCEDURE rsp_get_link_catg
            (
               presults        OUT SYS_REFCURSOR

            )
  IS
  BEGIN
    OPEN presults FOR
    SELECT *
      FROM sebl_link_catg t;
      
  END rsp_get_link_catg;

  -------------------------------------------------------------------------------------------

END pkg_apps_link;
/
