CREATE OR REPLACE PROCEDURE fsp_get_all_link
                          (
                            puser_flag      IN sebl_app_link.user_flag%TYPE DEFAULT NULL
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
         , COUNT(1) OVER (PARTITION BY l.catg_id) AS my_rank
      FROM sebl_app_link l
     INNER JOIN sebl_link_catg c
        ON l.catg_id = c.catg_id
     WHERE (l.user_flag = puser_flag OR l.user_flag= 2 OR  puser_flag IS NULL)   
       AND l.status=1
     ORDER BY my_rank DESC;
END fsp_get_all_link;
/
