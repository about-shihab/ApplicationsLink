<%@ Page Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Ho.aspx.cs" Inherits="ApplicationsLink.UI.Ho" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
     <link href="../Content/cardStyle.css?id=<%= DateTime.Now.ToString() %>" rel="stylesheet" />
    <script src="../Scripts/linkCardStyle.js"></script>
    <link href="../Theme/ArcUI/ARCmain.css?id=<%= DateTime.Now.ToString() %>" rel="stylesheet" />
    <link href="../Content/link_card.css?id=<%= DateTime.Now.ToString() %>" rel="stylesheet" />
    <link href="../Content/slick.css?id=<%= DateTime.Now.ToString() %>" rel="stylesheet" />
    <script src="../Scripts/slick.min.js?id=<%= DateTime.Now.ToString() %>"></script>
    <script src="../Scripts/appLink.js?id=<%=DateTime.Now.ToString() %>"></script>
    <style type="text/css">
        .panel.panel-default {
            box-shadow: 0 4px 25px 0 rgba(0, 0, 0, 0.3), 0 0 1px 0 rgba(0, 0, 0, 0.25);
        }
    </style>

    <script type="text/javascript">
        var favLinks = "<%=ViewState["FavLink"].ToString()%>";
        var recentLinks = "<%=ViewState["LinkLog"].ToString()%>";
        var user_flag = '1';
        var ipAddress = '<%= ipLabel.Text%>';

    </script>



    <asp:Label ID="ipLabel" runat="server" Text="Label" Visible="False"></asp:Label>
    <%--start recent div--%>
     <div class="row" style="margin-right: -12px;">
        <section class="panel panel-default shadow" style="border-radius: 0px 0px 30px 30px; text-align: left">
            <%--<div class="panel-header" style="background-color: black; color: white; border-radius: 0px 0px 30px 30px; text-align: center;">
                <header class="panel-heading font-bold">Recently Accessed Links</header>

            </div>--%>
            <div class="panel-header" style="background-color: white; color: black; border-bottom:3px solid black; text-align: center;">
                <header style="font-weight:400;padding:7px;" class="panel-heading font-bold">Recently Accessed Links</header>

            </div>
            <div class="panel-body" style="padding:10px">
                <div class="row">
                    <div class="recent-items" >


                    </div>
                </div>
                </div>
        </section>
    </div>
    <%--end recent div--%>

    <%--start fav div--%>
    <div class="row" style="margin-right: -12px;">
        <section class="panel panel-default shadow" style="border-radius: 0px 0px 30px 30px; /*background-color: ;*/ text-align: left">
            <div class="panel-header" style="background-color: white; color: black; border-bottom:3px solid orange; text-align: center;">
                <header style="font-weight:400;padding:7px;" class="panel-heading font-bold">Favourite Links</header>

            </div>

            <div class="panel-body" style="padding:10px">
                <div class="row">
                    <div class="multiple-items" >


                    </div>
                </div>
                </div>
        </section>
    </div>
    <%--end fav div--%>

    <%--start all link div--%>
    <div class="PageContent row" style="margin-top: 20px;">
        
        

        <section class="panel panel-default widget-chart" style="border-radius: 0px 30px; background-color: linen; text-align: left">
            <%--<div class="panel-header" style="margin: -11px -11px 6px -11px; background-color: darkgoldenrod; color: white; border-radius: 0px 30px 0px 30px; text-align: center;">
                <header class="panel-heading font-bold">All Applications Link</header>

            </div>--%>
            
            <div class="panel-header" style="background-color: linen; color: black; border-bottom:3px solid green; text-align: center;">
                <header style="font-weight:400;padding:7px;" class="panel-heading font-bold">All Applications Link</header>

            </div>
            
            <div class="panel-body ">
                <div class="row" id="categoryDiv">
                </div>
            </div>
        </section>

        
    

       
    </div>
    <%--end all link div--%>

</asp:Content>
