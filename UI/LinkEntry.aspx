<%@ Page Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="LinkEntry.aspx.cs" Inherits="ApplicationsLink.UI.LinkEntry" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <link href="../Content/bootstrap.css" rel="stylesheet" />
    <script src="../Scripts/bootstrap.js"></script>
    <style type="text/css">
        .textboxHeight {
            height: 25px;
            color: black;
            font-size: 12px;
            font-weight: 500;
            width: 100% !important;
        }
        .input-item{
            margin-top:10px;
        }
        .myLabel{
            text-align:right;
        }
        </style>
    <form id="linkForm" runat="server">
        <div class="panel panel-default">
            <div class="panel-heading">Add Category</div>
            <div class="panel-body">
                <div class="form-inline row  input-item">
                        <div class="col-md-4 myLabel">
                            <label style="display: block">Category Name</label>
                        </div>
                        <div class="col-md-8 form-group">

                            <asp:TextBox ID="catgTextBox" CssClass="form-control   textboxHeight" runat="server"></asp:TextBox>
                            

                        </div>

                    </div>
            </div>
            <div class="panel-footer text-right">
                <asp:Button ID="addCatgButton" class="btn btn-warning" runat="server" Text="Add Category"  OnClick="addCatgButton_Click"  />
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">Add Links</div>
            <div class="panel-body">
                <div class="col-md-6">
                    <div class="form-inline row  input-item">
                        <div class="col-md-4 myLabel">
                            <label style="display: block">Category</label>
                        </div>
                        <div class="col-md-8 form-group">

                            <asp:DropDownListChosen ID="categoryDropDownListChosen" runat="server" CssClass="form-control  mb-2 mr-sm-2"
                                Width="270px">
                            </asp:DropDownListChosen>

                        </div>

                    </div>
                    <div class="form-inline row  input-item">
                        <div class="col-md-4 myLabel">
                            <label style="display: block">Link User</label>
                        </div>
                        <div class="col-md-8 form-group">

                            <asp:DropDownListChosen ID="linkUserDropDownListChosen" runat="server" CssClass="form-control  mb-2 mr-sm-2"
                                Width="270px">
                                <asp:ListItem Text="All" Value="2" />
                                <asp:ListItem Text="Branch" Value="0" />
                                <asp:ListItem Text="Head Office" Value="1" />
                            </asp:DropDownListChosen>

                        </div>

                    </div>

                    <div class="form-inline row input-item">
                        <div class="col-md-4 myLabel">
                              <label style="display: block">
                                Link Image
                            </label>
                        </div>
                        <div class="col-md-8 form-group">
                            <asp:FileUpload CssClass="form-control-file" ID="FileUploadControl" runat="server" />
                        </div>
                         <span style="font-size:8px; color:red;"> Ex. Resolution (1000X500)</span>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-inline row input-item">
                        <div class="col-md-4 myLabel">
                            <label style="display: block">Link Title</label>
                        </div>
                        <div class="col-md-8 form-group">
                            <asp:TextBox ID="linkTitleTextBox" CssClass="form-control   textboxHeight" runat="server"></asp:TextBox>
                        </div>
                    </div>

                    <div class="form-inline row input-item">
                        <div class="col-md-4 myLabel">
                            <label style="display: block">Link URL</label>
                        </div>
                        <div class="col-md-8 form-group">

                            <asp:TextBox ID="urlTextBox" CssClass="form-control   textboxHeight" runat="server"></asp:TextBox>

                        </div>

                    </div>
                </div>
            </div>
            <div class="panel-footer text-right">
                <asp:Button ID="saveButton"   class="btn btn-primary" runat="server" Text="Save" OnClick="saveButton_Click" />
            </div>
        </div>

</form>
</asp:Content>
