using BLL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace ApplicationsLink.UI
{
    public partial class Ho : System.Web.UI.Page
    {
        LinkManager linkManager = new LinkManager();
        protected void Page_Load(object sender, EventArgs e)
        {

            ipLabel.Text = this.GetIP();
            if (ipLabel.Text.Equals("::1"))
                ipLabel.Text = "192.168.104.45";

            ViewState["FavLink"] = this.GetFavLink(ipLabel.Text).Replace(@"""", "");
            ViewState["LinkLog"] = this.GetLinkLog(ipLabel.Text).Replace(@"""", "");
            //ViewState["AllLink"] = this.GetAllLink(string.Empty).Replace(@"""", "");

        }
        public String GetIP()
        {
            String ip =
                HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];

            if (string.IsNullOrEmpty(ip))
            {
                ip = HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
            }

            return ip;
        }
        private string GetFavLink(string ipAddress)
        {
            string favLinks = string.Empty;
            DataTable dt = linkManager.GetFavLink(ipAddress);
            int i = 1;
            foreach (DataRow dr in dt.Rows)
            {
                favLinks += "<div  class='type-1' id='fav-item-" + dr["LINK_ID"].ToString() + "'>" +
                            "<span class='btn btn-dark closeBtn' style='left: 17px; border-radius: 50px; z-index:4; display: none; '>X</span>" +
                                 "<span class='linkId' style='display:none;'>" + dr["LINK_ID"].ToString() + "</span>" +
                                "<a href='" + dr["LINK_URL"].ToString() + "' target='_blank' class='btn btn-" + i + " anchor'>" +
                                    "<span class='txt favSpan'>" + dr["LINK_TITLE"].ToString() + "</span>" +
                                    "<span class='round favSpan'><i class='fa fa-chevron-right'></i></span>" +
                                "</a></div>";
                i++;
                if (i > 4)
                    i = 1;

            }
            return favLinks;
        }

        private string GetLinkLog(string ipAddress)
        {
            string favLinks = string.Empty;
            DataTable dt = linkManager.GetLinkLog(ipAddress);
            int i = 5;
            foreach (DataRow dr in dt.Rows)
            {
                favLinks += "<div  class='type-1'>" +
                            "<span class='btn btn-dark recentTime' style='left: 17px; border-radius: 30px; z-index:4; display: none; '>" + linkManager.GetTimeDifference(Convert.ToDateTime(dr["ACCESS_DT"])) + "</span>" +
                                 "<span class='linkId' style='display:none;'>" + dr["LINK_ID"].ToString() + "</span>" +
                                "<a href='" + dr["LINK_URL"].ToString() + "' target='_blank' class='btn btn-" + i + " anchor'>" +
                                    "<span class='txt favSpan'>" + dr["LINK_TITLE"].ToString() + "</span>" +
                                    "<span class='round favSpan'><i class='fa fa-chevron-right'></i></span>" +
                                "</a></div>";
                i++;
                if (i > 8)
                    i = 5;

            }
            return favLinks;
        }
        private string GetAllLink(string userFlag)
        {
            userFlag = "1";
            string cardLinksHtml = string.Empty;
            DataTable dt = linkManager.GetAllLink(userFlag, ipLabel.Text);
            DataView view = new DataView(dt);
            DataTable distinctCatg = view.ToTable(true, "CATG_ID", "CATG_NAME");

            string[] cardColor = { "Red", "Purple", "Pink", "Indigo", "Blue", "Cyan", "Teal", "Green", "Amber", "Deep-Orange" };
            string[] cardBackground = { "#FFCDD2", "#F3E5F5", "#FCE4EC", "#E8EAF6", "#E3F2FD", "#E0F7FA", "#E0F2F1", "#E8F5E9", "#FFF8E1", "#FBE9E7" };
            string[] fadeAnimation = { "fadeInLeft", "fadeInRight", "fadeInUp", "fadeInDown" };
            int i = 0;
            int k = 0;
            int f = 0;
            int c = 0;
            foreach (DataRow dr in distinctCatg.Rows)
            {
                if (c % 3 == 0)
                {
                    cardLinksHtml += "<div class='row'>";
                }
                //k = getRandomArbitrary(0, 10);
                Random rnd = new Random();
                f = rnd.Next(0, 3);
                //console.log(k);
                cardLinksHtml += "<div class='col-md-4  animated " + fadeAnimation[f] + "' style='animation-duration: 1s'>" +
                    "<section class='panel panel-default ' style='border-radius:30px; background-color:" + cardBackground[k] + ";'>" +
                    "<header class='panel-heading lt no-border '>" +
                    "<div class='clearfix'><div class='clear'>" +
                    "<article class='material-card " + cardColor[k] + " mc-active  shadow'>" +
                    "<h2><strong><i class='fa fa-fw fa-star'></i> ";
                cardLinksHtml += dr["CATG_NAME"].ToString();
                cardLinksHtml += "</strong> </h2 ></article > </div > </div > </header > <div class='panel-body '>";
                //linkJsonData = jsonData.filter(element => element.CATG_ID == categories[i].CATG_ID);
                int r = 0;
                string tooltipTitle = "Remove from Favourites";
                DataTable catWiseLink = dt.AsEnumerable()
                             .Where(m => m.Field<string>("CATG_NAME").ToString().Equals(dr["CATG_NAME"].ToString()))
                             .CopyToDataTable();
                foreach (DataRow lr in catWiseLink.Rows)
                {
                    string favIconClass = "fa-heart";

                    string isFav = lr["IS_FAV"].ToString();
                    if (isFav.Equals("0"))
                    {
                        favIconClass = "fa-plus";
                        tooltipTitle = "Add to Favourites";
                    }
                    f = rnd.Next(0, 3);
                    if (r % 2 == 0)
                    {
                        cardLinksHtml += "<div class='row'>";
                    }
                    cardLinksHtml += "<div class='col-md-6  animated " + fadeAnimation[f] + "'  style = 'animation-duration: 2s' >" +
                                    "<div class='card ' > " +
                                    "<div class='card-img' style = 'background-image: url(../LinkImage/webmail.jpg);' > " +
                                    "<div class='overlay' > " +
                                    "<div class='overlay-content' > " +
                                    "<div class='row' style = 'margin-right: 0px; margin-left: 0px; height:40px; margin-top:-15px' > " +
                        "<a style='border-radius: 0px 0px 10px 10px; background-color:red; border: none; delay: 0' href='#' data-toggle='tooltip' title='" + tooltipTitle + "' class='favLinkButton' >" +
                        "<p hidden class='linkId' > " + lr["LINK_ID"].ToString() + " </p><i class='fa " + favIconClass + "'></i></a> " +
                                    "</div>" +
                                    "<div class='row' style='margin-right: 0px; margin-left: 0px; height:60px;margin-top:15px'>" +
                                    "<a  style='margin-top:28px' class='hover link_url' href='" + lr["LINK_URL"].ToString() + "' target='_blank'>View</a>" +
                                    "</div>" +
                                    "</div>" +
                                    "</div>" +
                                    "</div>" +
                                    "<a style='text-decoration:none; display: block;color: #202927;' href='" + lr["LINK_URL"].ToString() + "'  target='_blank'>" +
                                    "<div class='card-content " + cardColor[k] + "' >" +
                                    "<h2>" + lr["LINK_TITLE"].ToString() + "</h2>" +
                                    "</div>" +
                                    "</a>" +
                                    "</div>" +
                                    "</div>";
                    r += 1;
                    if (r % 2 == 0)
                    {
                        cardLinksHtml += "</div>";
                    }
                }

                cardLinksHtml += "</div></section ></div>";

                k += 1;
                if (k > cardColor.Length)
                {
                    k = 0;
                }

                c += 1;
                //if (i > 0 && i < dt.Rows.Count)
                //{

                //    int previousRowLength = Math.Round(jsonData.filter(element => element.CATG_ID == categories[i - 1].CATG_ID).length / 2);

                //    int nextRowLength = Math.round(jsonData.filter(element => element.CATG_ID == categories[i + 1].CATG_ID).length / 2);
                //    int currentRowLength = Math.round(linkJsonData.length / 2);

                //    //console.log(previousRowLength);
                //    //console.log(currentRowLength);
                //    //console.log(nextRowLength);
                //    if ((previousRowLength - currentRowLength) >= nextRowLength)
                //    {
                //        c -= 1;
                //    }

                //}

                if (c % 3 == 0)
                {

                    cardLinksHtml += "</div>";

                }
            }
            return cardLinksHtml;
        }
    }
}