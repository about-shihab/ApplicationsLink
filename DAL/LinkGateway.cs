using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class LinkGateway
    {
        string connectionString = ConfigurationManager.ConnectionStrings["ULTIMUS"].ToString();

        public DataTable GetDataByProcedure(Hashtable inputParamHt, Hashtable outputParamHt, string procedureName)
        {
            DataTable dtab = new DataTable();
            using (OracleConnection connection = new OracleConnection())
            {

                connection.ConnectionString = connectionString;
                try
                {

                    connection.Open();
                    OracleCommand command = new OracleCommand();
                    command.Connection = connection;
                    command.CommandText = procedureName;
                    command.CommandType = CommandType.StoredProcedure;
                    //command.BindByName = true;
                    foreach (object obj in inputParamHt.Keys)
                    {
                        string ColumnName = Convert.ToString(obj);
                        if (string.IsNullOrEmpty(inputParamHt[obj].ToString()))
                        {
                            OracleParameter param = new OracleParameter(ColumnName, DBNull.Value);
                            command.Parameters.Add(param);
                        }
                        else
                        {
                            OracleParameter param = new OracleParameter(ColumnName, inputParamHt[obj]);
                            command.Parameters.Add(param);
                        }
                    }
                    //foreach (var value in inputParamHt.Values)
                    //{
                    //    command.Parameters.Add("value", OracleDbType.Varchar2).Value = value;

                    //}
                    foreach (var value in outputParamHt.Values)
                    {
                        command.Parameters.Add("value", OracleDbType.RefCursor).Direction = ParameterDirection.Output;
                    }

                    OracleDataReader dr = command.ExecuteReader();
                    dtab.Load(dr);

                    //adp.SelectCommand = command;
                    //adp.Fill(dtab);

                    command.Parameters.Clear();
                    return dtab;

                }

                catch (OracleException ex)
                {
                    throw ex;
                }
                finally
                {
                    connection.Close();
                }
            }
        }

        public DataTable AddLink(Dictionary<string, object> inputDic)
        {

            Dictionary<string, object> outputtDic = new Dictionary<string, object>();
            outputtDic.Add("perrormsg", 1);

            return this.GetDataByProcedure(inputDic, outputtDic, "pkg_apps_link.fsp_addup_link");
        }
        public DataTable GetAllLink(string userFlag, string ipAdddress)
        {
            //Hashtable inputHt = new Hashtable();
            //inputHt.Add("puser_flag", userFlag);
            //inputHt.Add("pip_address", ipAdddress);

            //Hashtable outputHt = new Hashtable();
            //outputHt.Add("presults", "presults");

            //return this.GetDataByProcedure(inputHt, outputHt, "pkg_apps_link.fsp_get_all_link");

            Dictionary<string, object> inputDic = new Dictionary<string, object>();

            inputDic.Add("puser_flag", userFlag);
            inputDic.Add("pip_address", ipAdddress);

            Dictionary<string, object> outputtDic = new Dictionary<string, object>();
            outputtDic.Add("presults", "presults");

            return this.GetDataByProcedure(inputDic, outputtDic, "pkg_apps_link.fsp_get_all_link");


        }

        public DataTable GetFavLink(string ipAdddress)
        {
            
            Dictionary<string, object> inputDic = new Dictionary<string, object>();
            inputDic.Add("pip_address", ipAdddress);

            Dictionary<string, object> outputtDic = new Dictionary<string, object>();
            outputtDic.Add("presults", "presults");

            return this.GetDataByProcedure(inputDic, outputtDic, "pkg_apps_link.rsp_get_fav_link");


        }

        public DataTable GetLinkLog(string ipAdddress)
        {

            Dictionary<string, object> inputDic = new Dictionary<string, object>();
            inputDic.Add("pip_address", ipAdddress);

            Dictionary<string, object> outputtDic = new Dictionary<string, object>();
            outputtDic.Add("presults", "presults");

            return this.GetDataByProcedure(inputDic, outputtDic, "pkg_apps_link.rsp_get_link_log");


        }

        public DataTable SetLinkLog(string pip_address, string plink_id)
        {
            Dictionary<string, object> inputDic = new Dictionary<string, object>();
            inputDic.Add("pip_address", pip_address);
            inputDic.Add("plink_id", plink_id);

            Dictionary<string, object> outputtDic = new Dictionary<string, object>();
            outputtDic.Add("perrormsg", 250);

            return this.GetDataByProcedure(inputDic, outputtDic, "pkg_apps_link.fsp_set_link_log");
        }
        public string SetFavLink(string pip_address, string plink_id)
        {
            string procedureNm = "pkg_apps_link.fsp_set_fav_link";
            return this.SetUpdateFavLink(pip_address, plink_id, procedureNm);
        }
        public string UpdateFavLink(string pip_address, string plink_id)
        {
            string procedureNm = "pkg_apps_link.fsp_set_fav_link";
            return this.SetUpdateFavLink(pip_address, plink_id, procedureNm);
        }

        public string SetUpdateFavLink(string pip_address, string plink_id, string procedureNm)
        {
            OracleDataAdapter adp = new OracleDataAdapter();
            using (OracleConnection connection = new OracleConnection())
            {

                connection.ConnectionString = connectionString;
                try
                {

                    connection.Open();
                    OracleCommand command = new OracleCommand();
                    command.Connection = connection;
                    command.CommandText = procedureNm;
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.Add("pip_address", OracleDbType.Varchar2, 32).Value = pip_address;
                    command.Parameters.Add("plink_id", OracleDbType.Varchar2, 4).Value = plink_id;
                    command.Parameters.Add("perrormsg", OracleDbType.Varchar2, 2000).Direction = ParameterDirection.Output;
                    command.ExecuteNonQuery();
                    string perrormsg = command.Parameters["perrormsg"].Value.ToString();
                    command.Parameters.Clear();
                    return perrormsg;
                }

                catch (OracleException ex)
                {
                    throw ex;
                }
                finally
                {
                    connection.Close();
                }
            }
        }

        private DataTable GetDataByProcedure(Dictionary<string, object> inputParamHt, Dictionary<string, object> outputParamHt, string procedureName)
        {
            DataTable dtab = new DataTable();
            using (OracleConnection connection = new OracleConnection())
            {

                connection.ConnectionString = connectionString;
                try
                {

                    connection.Open();
                    OracleCommand command = new OracleCommand();
                    command.Connection = connection;
                    command.CommandText = procedureName;
                    command.CommandType = CommandType.StoredProcedure;
                    foreach (string obj in inputParamHt.Keys)
                    {
                        string ColumnName = Convert.ToString(obj);
                        if (string.IsNullOrEmpty(inputParamHt[obj].ToString()))
                        {
                            OracleParameter param = new OracleParameter(ColumnName, DBNull.Value);
                            command.Parameters.Add(param);
                        }
                        else
                        {
                            int size = Convert.ToInt32(inputParamHt[obj].ToString().Length);
                            OracleParameter param = new OracleParameter(ColumnName, inputParamHt[obj]);
                            command.Parameters.Add(param);
                        }
                    }

                    foreach (string obj in outputParamHt.Keys)
                    {
                        string ColumnName = Convert.ToString(obj);
                        if (ColumnName.Equals("presults"))
                        {
                            command.Parameters.Add(ColumnName, OracleDbType.RefCursor).Direction = ParameterDirection.Output;
                        }

                        else
                        {
                            command.Parameters.Add(ColumnName, OracleDbType.Varchar2, Convert.ToInt32(outputParamHt[obj].ToString())).Direction = ParameterDirection.Output;

                        }
                    }

                    OracleDataReader dr = command.ExecuteReader();
                    dtab.Load(dr);

                    command.Parameters.Clear();
                    return dtab;

                }

                catch (OracleException ex)
                {
                    throw ex;
                }
                finally
                {
                    connection.Close();
                }
            }
        }

        public DataTable AddCategory(Dictionary<string, object> inputDic)
        {

            Dictionary<string, object> outputtDic = new Dictionary<string, object>();
            outputtDic.Add("perrormsg", 1);

            return this.GetDataByProcedure(inputDic, outputtDic, "pkg_apps_link.fsp_set_link_catg");
        }
        public DataTable GetLinkCatgory()
        {

            Dictionary<string, object> inputDic = new Dictionary<string, object>();

            Dictionary<string, object> outputtDic = new Dictionary<string, object>();
            outputtDic.Add("presults", "presults");

            return this.GetDataByProcedure(inputDic, outputtDic, "pkg_apps_link.rsp_get_link_catg");


        }
    }
}
