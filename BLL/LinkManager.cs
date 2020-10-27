using DAL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL
{
    public class LinkManager
    {
        LinkGateway linkGateway = new LinkGateway();
        public DataTable GetAllLink(string userFlag, string ipAdddress)
        {

            return linkGateway.GetAllLink(userFlag, ipAdddress);


        }
        public DataTable GetFavLink(string ipAdddress)
        {
            return linkGateway.GetFavLink(ipAdddress);
        }
        public string SetFavLink(string pip_address, string plink_id)
        {
            return linkGateway.SetFavLink(pip_address, plink_id);
        }
        public string UpdateFavLink(string pip_address, string plink_id)
        {
            return linkGateway.UpdateFavLink(pip_address, plink_id);
        }
        public DataTable SetLinkLog(string pip_address, string plink_id)
        {
            return linkGateway.SetLinkLog(pip_address, plink_id);
        }
        public DataTable GetLinkLog(string ipAdddress)
        {
            return linkGateway.GetLinkLog(ipAdddress);

        }

        public DataTable AddLink(Dictionary<string, object> inputDic)
        {
            return linkGateway.AddLink(inputDic);
        }
        public DataTable AddCategory(Dictionary<string, object> inputDic)
        {
            return linkGateway.AddCategory(inputDic);
        }
        public DataTable GetLinkCatgory()
        {
            return linkGateway.GetLinkCatgory();
        }
        public string GetTimeDifference(DateTime accessDt)
        {
            const int SECOND = 1;
            const int MINUTE = 60 * SECOND;
            const int HOUR = 60 * MINUTE;
            const int DAY = 24 * HOUR;
            const int MONTH = 30 * DAY;

            var ts = new TimeSpan(DateTime.Now.Ticks - accessDt.Ticks);
            double delta = Math.Abs(ts.TotalSeconds);

            if (delta < 1 * MINUTE)
                return ts.Seconds == 1 ? "one second ago" : ts.Seconds + " seconds ago";

            if (delta < 2 * MINUTE)
                return "a minute ago";

            if (delta < 45 * MINUTE)
                return ts.Minutes + " minutes ago";

            if (delta < 90 * MINUTE)
                return "an hour ago";

            if (delta < 24 * HOUR)
                return ts.Hours + " hours ago";

            if (delta < 48 * HOUR)
                return "yesterday";

            if (delta < 30 * DAY)
                return ts.Days + " days ago";

            if (delta < 12 * MONTH)
            {
                int months = Convert.ToInt32(Math.Floor((double)ts.Days / 30));
                return months <= 1 ? "one month ago" : months + " months ago";
            }
            else
            {
                int years = Convert.ToInt32(Math.Floor((double)ts.Days / 365));
                return years <= 1 ? "one year ago" : years + " years ago";
            }
        }
    }
}
