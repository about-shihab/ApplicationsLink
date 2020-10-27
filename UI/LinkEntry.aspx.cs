using BLL;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace ApplicationsLink.UI
{
    public partial class LinkEntry : System.Web.UI.Page
    {
        LinkManager linkManager = new LinkManager();
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {

                this.BindLinkCategory();
            }
        }
        private void BindLinkCategory()
        {
            categoryDropDownListChosen.DataSource = linkManager.GetLinkCatgory();

            categoryDropDownListChosen.DataTextField = "CATG_NAME";
            categoryDropDownListChosen.DataValueField = "CATG_ID";
            categoryDropDownListChosen.DataBind();
        }

        protected void saveButton_Click(object sender, EventArgs e)
        {
            string[] validFileTypes = { "png", "jpg", "jpeg"};
            string ext = System.IO.Path.GetExtension(FileUploadControl.PostedFile.FileName);

            bool isValidFile = false;

            for (int i = 0; i < validFileTypes.Length; i++)

            {

                if (ext == "." + validFileTypes[i])

                {

                    isValidFile = true;

                    break;

                }

            }
            string errorMsg = "Successfull";
            if (isValidFile)
            {
                try
                {
                    string filename = Path.GetFileName(FileUploadControl.FileName);
                    string filePath = Server.MapPath("~/LinkImage/") + DateTime.Now.ToString("ddMMyyyyhhmmss") + filename;
                    FileUploadControl.SaveAs(filePath);
                    Dictionary<string, object> inputDic = new Dictionary<string, object>();
                    inputDic.Add("puser_flag", linkUserDropDownListChosen.SelectedValue);
                    inputDic.Add("plink_title", linkTitleTextBox.Text.Trim());
                    inputDic.Add("pcatg_id", categoryDropDownListChosen.SelectedValue);
                    inputDic.Add("plink_url", urlTextBox.Text.Trim());
                    inputDic.Add("plink_img_url", filePath);
                    inputDic.Add("pmake_by", "Admin");
                    try
                    {
                        DataTable dt= linkManager.AddLink(inputDic);
                        errorMsg = "Successfully saved";
                    }
                    catch (Exception ex)
                    {
                        errorMsg = "Error Occured. Enter input data properly";

                    }

                }
                catch (Exception ex)
                {
                    errorMsg = "File Upload Error";

                }
            }
            else
            {
                errorMsg = "Upload Only Image File";

            }

            ClientScript.RegisterStartupScript(this.GetType(), "myalert", "alert('"+errorMsg+"');", true);

        }

        protected void addCatgButton_Click(object sender, EventArgs e)
        {

            Dictionary<string, object> inputDic = new Dictionary<string, object>();
            
            inputDic.Add("pcatg_name", catgTextBox.Text.Trim());
            inputDic.Add("pmake_by", "Admin");
            string errorMsg = string.Empty;
            try
            {
                DataTable dt = linkManager.AddCategory(inputDic);
                errorMsg = "Successfully saved";
                this.BindLinkCategory();
            }
            catch (Exception ex)
            {
                errorMsg = "Error Occured. Enter input data properly";

            }
            ClientScript.RegisterStartupScript(this.GetType(), "myalert", "alert('" + errorMsg + "');", true);

        }
    }
}