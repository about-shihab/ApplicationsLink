using BLL;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Services;

namespace ApplicationsLink.Service
{
    /// <summary>
    /// Summary description for LinkService
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class LinkService : System.Web.Services.WebService
    {

        LinkManager linkManager = new LinkManager();

        public string DatatableToJson(DataTable dt)
        {
            List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
            Dictionary<string, object> row;
            foreach (DataRow dr in dt.Rows)
            {
                row = new Dictionary<string, object>();
                foreach (DataColumn col in dt.Columns)
                {

                    //if ((col.ColumnName == "TRANS_DATE")||(col.ColumnName == "Acc. Expiry Date") || (col.ColumnName == "Acc. Opening Date"))
                    //{
                    //    string columnName = col.ColumnName.Replace(".", "");
                    //    string date = Convert.ToDateTime(dr[col]).ToString("dd/MM/yyyy");
                    //    row.Add(columnName, date);
                    //}
                    //else
                    //{
                    row.Add(col.ColumnName.Replace(".", ""), dr[col].GetType() == typeof(DateTime) ? Convert.ToDateTime(dr[col]).ToString("dd/MM/yyyy") : dr[col]);

                    //}
                }
                rows.Add(row);
            }

            return JsonConvert.SerializeObject(rows);
        }


        [WebMethod]
        public string HelloWorld()
        {
            return "Hello World";
        }

        [WebMethod]
        public string GetAllLinkByUser(string userFlag, string ipAdddress)
        {


            DataTable dt = linkManager.GetAllLink(userFlag, ipAdddress);

            return this.DatatableToJson(dt);
        }

        [WebMethod]
        public string SetFavLink(string pip_address, string plink_id)
        {
            string perrormsg = linkManager.SetFavLink(pip_address, plink_id);
            return JsonConvert.SerializeObject(perrormsg);

        }
        [WebMethod]
        public string UpdateFavLink(string pip_address, string plink_id)
        {
            string perrormsg = linkManager.UpdateFavLink(pip_address, plink_id);
            return JsonConvert.SerializeObject(perrormsg);

        }
        [WebMethod]
        public string GetFavLink(string pip_address)
        {
            DataTable dt = linkManager.GetFavLink(pip_address);
            return this.DatatableToJson(dt);

        }


        [WebMethod]
        public string SetLinkLog(string pip_address, string plink_id)
        {
            DataTable dt = linkManager.SetLinkLog(pip_address, plink_id);
            return this.DatatableToJson(dt);

        }
        [WebMethod]
        public string GetLinkLog(string pip_address)
        {
            DataTable dt = linkManager.GetLinkLog(pip_address);
            dt.Columns.Add("TIME_INTERVAL", typeof(String));
            foreach(DataRow dr in dt.Rows)
            {
                dr["TIME_INTERVAL"] = linkManager.GetTimeDifference(Convert.ToDateTime(dr["ACCESS_DT"]));
            }
            return this.DatatableToJson(dt);

        }
        
    }
}
