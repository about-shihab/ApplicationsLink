$(window).on('load', function () {
    setTimeout(removeLoader, 3000); //wait for page load PLUS two seconds.
    //removeLoader();
});

function removeLoader() {
    $("#myLoader").fadeOut(500, function () {
        // fadeOut complete. Remove the loading div
        $("#myLoader").remove(); //makes page more lightweight 
    });
};
$(document).ready(function () {


    var pieOfpieChart = null,
        tl_pieOfpieChart = null,
        chart = null,
        particularId = null,
        particularNm = null,
        myColumns = [];

    chartInitialize();


    $("#transDatepicker").datepicker({
        dateFormat: 'dd/mm/yy',
        changeMonth: true,
        changeYear: true,
        constrainInput: false,
        onSelect: function (dateText) {
            $(this).change();
        }
    }).on("change", function () {
        var trns_dt = this.value;

        $('#firstLayerTable').DataTable().destroy();
        LoadMainTable(trns_dt);
        LoadTopTenTable(trns_dt)

        //LoadSinglePieData(trns_dt);


    });


    //load main table by yeasterday date
    GetTableByYeasterday();


    //close modal
    //$('#flBack').click(function () {
    //    alert("hi");
    //});

    //target value onchange
    $('#firstLayerTable tbody').on('input', 'tr', function () {

        var table = $('#firstLayerTable').DataTable();
        var data_row = table.row($(this).closest('tr')).data();
        var targetValue = $(this).find('#targetTextbox').val();



        $(this).find('#remarksDiv').empty();
        if (targetValue > data_row.AS_ON_DATE && targetValue > 0) {
            $('<span><i style="color:red;" class="fa fa-times">  Target breached</i></span>').appendTo($(this).find('#remarksDiv'));
        } else if (targetValue <= data_row.AS_ON_DATE && targetValue > 0)
            $('<span><i style="color:green;" class="fa fa-check">  Target within Limit</i></span>').appendTo($(this).find('#remarksDiv'));
        else {
            if (targetValue < 0)
                $('<div >Enter Positive value</div>').appendTo($(this).find('#remarksDiv'));

        }



    });

    ///edit target
    $('#firstLayerTable').on('click', '#editTargetBtn', function () {
        var table = $('#firstLayerTable').DataTable();
        var data_row = table.row($(this).closest('tr')).data();
        //alert($(this).find('#target_label'));
        //var test = $(this).find('label').val();
        //console.log(test);
        //var target_amount = $('#myInput');
        //console.log(target_amount);
        $(this).closest('tr').find('#target_label').empty();//targetButton
        $(this).closest('tr').find('#editTargetBtn').hide();//targetButton

        $('<input type="number" class="form-control-sm" id="targetTextbox" value="' + data_row.CURRENT_TARGET + '" style="width:7em" >').appendTo($(this).closest('tr').find('#target_label'));
        $('<button type="button" class="btn btn-success svbtn btn-sm" style="padding: 0px 10px;" id="saveTargetBtn""><i class="fa fa-check"></i></button >').appendTo($(this).closest('tr').find('#targetButton'));
        $('<button type="button" class="btn btn-danger svbtn btn-sm" style="padding: 0px 10px;" id="cancelTargetBtn""><i class="fa fa-times"></i></button >').appendTo($(this).closest('tr').find('#targetButton'));
       // $(this).find("i").removeClass("fa fa-check").addClass("fa fa-save");
    });

    //save target
    $('#firstLayerTable').on('click', '#saveTargetBtn', function () {
        var table = $('#firstLayerTable').DataTable();
        var data_row = table.row($(this).closest('tr')).data();
        console.log(data_row);
        var target_amount = $('#targetTextbox').val();
        data_row.CURRENT_TARGET = $('#targetTextbox').val();
        console.log(target_amount);
        var url = "../Service/GetLoanStatusService.asmx/UpdateCurrentTarget";
        var parameter = {
            ptarget_value: target_amount,
            ptrans_dt: data_row.TRANS_DATE,
            pparticulars_id: data_row.PARTICULARS_ID
        };
        AjaxPostRequest(url, parameter, function (response) {
            var jsonData = JSON.parse(response.d);
            if (jsonData != 'null')
                alert(jsonData);
            
            
        });
        
        
        $(this).closest('tr').find('#target_label').empty();//targetButton

        $('<label id="myInput" class="">' + target_amount + '</label>').appendTo($(this).closest('tr').find('#target_label'));

        $(this).closest('tr').find('#editTargetBtn').show();
        $(this).closest('tr').find('#cancelTargetBtn').remove();
        $(this).closest('tr').find('#saveTargetBtn').remove();
        
        //alert("saved");
    });

    //cancel button
    $('#firstLayerTable').on('click', '#cancelTargetBtn', function () {
        var table = $('#firstLayerTable').DataTable();
        var data_row = table.row($(this).closest('tr')).data();
        $(this).closest('tr').find('#editTargetBtn').show();

        $(this).closest('tr').find('#target_label').empty();//targetButton

        $('<label id="myInput" class="">' + data_row.CURRENT_TARGET + '</label>').appendTo($(this).closest('tr').find('#target_label'));
        $(this).closest('tr').find('#saveTargetBtn').remove();
        $(this).closest('tr').find('#cancelTargetBtn').remove();

        
    });

    $('#topButtonDiv').click(function (e) {
        if ($('#topTenAside').hasClass("settings-open")) {
            $('#topTenAside').removeClass("settings-open");
            $('.buttonSvg').css({
                top: '80vh',
                left: '95vw',
                position: 'fixed'
            });

        } else {
            $('#topTenAside').addClass("settings-open");
            $('.buttonSvg').css({
                top: '80vh',
                left: '60vw',
                position: 'fixed'
            });
        }
        //$('#topTenAside').toggleClass("settings-open");
        //$('.buttonSvg').css({top: '90vh', left: '60vw', position: 'fixed' });



        // alert(1);
    });


    //open second layer
    $('#firstLayerTable tbody').on('click', 'td', function () {

        if ($(this).index() == 5) { // provide index of your column in which you prevent row click here is column of 4 index
            return;
        }

        //$('svg').hide();

        var table = $('#firstLayerTable').DataTable();

        var data_row = table.row($(this).closest('tr')).data();
        console.log(data_row);
        var trans_Dt = $('#transDatepicker').val();
        var dtArr = trans_Dt.split('/');


        $('#firstModalTitle').empty();
        $('<div><h4 class="text-center text-white"><b>' + data_row.PARTICULARS_NAME + '</b></h4></div>').appendTo($('#firstModalTitle'));

        //change date badge
        $('#dayBadge').empty();
        $('#monthBadge').empty();
        $('#yrBadge').empty();
        $('#dayBadge').text(dtArr[0]);
        $('#monthBadge').text(dtArr[1]);
        $('#yrBadge').text(dtArr[2]);

        $('#secondLayerTableHeader').empty();
        $('<header class="panel-heading font-bold">Branch Wise ' + data_row.PARTICULARS_NAME + '</header>').appendTo($('#secondLayerTableHeader'));

        // you can do additional functionality by clicking on this column here
        $('#secondLayerTable').DataTable().destroy();

        $('#myModal').modal('show');
        particularNm = data_row.PARTICULARS_NAME;
        particularId = data_row.PARTICULARS_ID;
        LoadSecondLayerTable(data_row.TRANS_DATE, particularId);

        if (particularId == 4) {
            $('#slpie').show();
            LoadSinglePieData(data_row.TRANS_DATE);
        }

        else {
            $('#slpie').hide();
        }

      
        //load Seconnd Layer PieOfPieChart
        LoadSLPieOfPieData(data_row);

        // $('#secondLayerTable').find("input").removeClass("fa fa-check").addClass("form-control");
    });

    //open third layer
    $('#secondLayerTable tbody').on('click', 'td', function () {
        var table = $('#secondLayerTable').DataTable();
        var thirdlayer_data_row = table.row($(this).closest('tr')).data();
        if (thirdlayer_data_row == null)
            return;

        var trans_Dt = $('#transDatepicker').val();
        var dtArr = trans_Dt.split('/');
        //change date badge
        $('#db2').empty();
        $('#mb2').empty();
        $('#yb2').empty();
        $('#db2').text(dtArr[0]);
        $('#mb2').text(dtArr[1]);
        $('#yb2').text(dtArr[2]);

        $('#firstParticularNm').empty();
        $('#ScndParticularNm').empty();
        $('<p class="half__txt" >' + particularNm + '</p>').appendTo($('#firstParticularNm'));
        $('<p class="half__txt" >' + thirdlayer_data_row.BR_NM + ' </p>').appendTo($('#ScndParticularNm'));

        console.log(thirdlayer_data_row);
        //service url for customer, depositor, loan customer no.
        url = "../Service/GetLoanStatusService.asmx/GetBranchWiseParticularData";

        //customer No
        SetCustomerNo(thirdlayer_data_row.BRANCH_ID, trans_Dt, 1, url)
        // SetLoanCustomerNo
        SetCustomerNo(thirdlayer_data_row.BRANCH_ID, trans_Dt, 2, url)
        //depositors no
        SetCustomerNo(thirdlayer_data_row.BRANCH_ID, trans_Dt, 3, url)

        //$('#trans_dt').empty();
        //$('<strong>' + trans_Dt + '</strong>').appendTo($('#trans_dt'));

        //thirdlayer dataTable

        // LoadThirdLayer(thirdlayer_data_row.BRANCH_ID, trans_Dt, particularId, LoadThirdLayerTable)
        myColumns = [];

        var columnNameUrl = "../Service/GetLoanStatusService.asmx/GetColumnName";
        LoadThirdLayer(thirdlayer_data_row.BRANCH_ID, trans_Dt, particularId, columnNameUrl, function (response) {
            var jsonData = JSON.parse(response.d);
            $.each(jsonData, function (key, value) {
                myColumns.push({
                    "data": value,
                    "title": value
                });
            });
            //return myColumns;
            LoadThirdLayerDatatable(thirdlayer_data_row.BRANCH_ID, trans_Dt, particularId, myColumns);


        });

        //load third layer pieof pie data
        tl_LoadSLPieOfPieData(trans_Dt, particularId, thirdlayer_data_row.BRANCH_ID);


        //LoadThirdLayerDatatable('0002','08/10/2019',4)

        $('#myModal2').modal('show');




    });



    //first layer table
    function LoadMainTable(ptrans_dt) {
        var url = "../Service/GetLoanStatusService.asmx/GetRmsMastData";
        var parameter = {
            ptrans_dt: ptrans_dt
        };
        if ($.fn.DataTable.isDataTable('#firstLayerTable')) {
            $('#firstLayerTable').DataTable().destroy();
        }
        AjaxPostRequest(url, parameter, function (response) {
            var jsonData = JSON.parse(response.d);
            console.log(jsonData);
            $('#firstLayerTable').DataTable({
                "destroy": true, 
                data: jsonData,
                "aaSorting": [],
                "columnDefs": [{
                    "orderable": false,
                    "targets": 0,
                    "visible": false
                },
                {
                    "orderable": false,
                    "targets": 1,
                    "visible": false
                },
                {
                    "orderable": false,
                    "targets": 2
                },
                {
                    "orderable": false,
                    "targets": 3,
                    "className": "text-right"
                },
                {
                    "orderable": false,
                    "targets": 4,
                    "className": "text-right"
                },
                {
                    "orderable": false,
                    "targets": 5,
                    "className": "text-right"
                },
                {
                    "orderable": false,
                    "targets": 6,
                    "className": "text-right"
                },
                {
                    "orderable": false,
                    "targets": 7
                },
                {
                    "orderable": false,
                    "targets": 8,
                    "className": "text-right"
                },
                {
                    "orderable": false,
                    "targets": 9
                }
                ],

                "columns": [{
                    "data": "TRANS_DATE"
                },
                {
                    "data": "PARTICULARS_ID"
                },
                {
                    "data": "PARTICULARS_NAME"
                },
                {
                    "data": "FIRST_QTR"
                },
                {
                    "data": "SECOND_QTR"
                },
                {
                    "data": "THIRD_QTR"
                },
                {
                    "data": "FOURTH_QTR"
                },
                {
                    'data': "CURRENT_TARGET",
                    'render': function (data) {
                        return '<div class="input-group"  style="background-color:#eee;text-align: center;">' +
                            '<div id="target_label"><label id="myInput" class="">'+data+'</label></div>' +
                            '<span class="input-group-btn" id="targetButton">' +
                            '<button type="button" class="btn btn-info svbtn btn-sm" style="padding: 0px 10px;" id="editTargetBtn""><i class="fa fa-pencil"></i></button >' +
                            '</span></div >'

                        //fa fa-pencil
                    }
                },
                {
                    "data": "AS_ON_DATE"
                },
                {
                    'data': null,
                    'render': function (data, type, row) {
                        var html = '<span><i style="color:red;" class="fa fa-times">  Target breached</i></span>';
                        
                        if (row.CURRENT_TARGET <= row.AS_ON_DATE) {

                            html = '<span><i style="color:green;" class="fa fa-check">  Target within Limit</i></span>';
                        }

                        return '<div id="remarksDiv">' + html + '</div>';
                    },
                    'width': '14%'
                }
                ],
                "searching": false,
                "paging": false,
                "scrollCollapse": false,
                //"scrollY": "500px",

                "orderable": false,
                "responsive": true,
                "select": true,
                "language": {
                    "info": "",

                }
            });
        });
    };

    //load second layer table
    function LoadSecondLayerTable(ptransDt, pparticular_id) {

        var url = "../Service/GetLoanStatusService.asmx/GetBranchWiseData";
        var parameter = {
            ptransDt: ptransDt,
            pparticular_id: pparticular_id
        };
        if ($.fn.DataTable.isDataTable('#secondLayerTable')) {
            $('#secondLayerTable').DataTable().destroy();
        }
        AjaxPostRequest(url, parameter, function (response) {
            var jsonData = JSON.parse(response.d);
            $('#secondLayerTable').DataTable({
                "destroy": true, 
                data: jsonData,
                "aaSorting": [],
                "columnDefs": [{
                    "orderable": false,
                    "targets": 0,
                    "visible": false
                },
                {
                    "orderable": false,
                    "targets": 1,
                    "className": "text-left"
                },
                {
                    "orderable": false,
                    "targets": 2,
                    "className": "text-right"
                }

                ],

                "columns": [{
                    "data": "BRANCH_ID"
                },
                {
                    "data": "BR_NM"
                },
                {
                    "data": "OUTSTANDING"
                }
                ],

                //"searching": false,
                "paging": false,
                "scrollY": "400px",
                "scrollCollapse": true,
                "orderable": false,
                "select": true,
                "language": {
                    "info": "Showing _TOTAL_ branches ",
                }
            });
        });


    };

    function GetTableByYeasterday() {
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        var dd = String(yesterday.getDate()).padStart(2, '0');
        var mm = String(yesterday.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = yesterday.getFullYear();

        yesterday = dd + '/' + mm + '/' + yyyy;
        var $datepicker = $('#transDatepicker');
        $datepicker.datepicker();
        $datepicker.datepicker('setDate', yesterday);

        LoadMainTable(yesterday);
        LoadTopTenTable(yesterday);
    }



    function LoadThirdLayerDatatable(pbranch_id, ptrans_dt, pparticular_id, myColumns) {
        //var myColumns=LoadThirdLayer(pbranch_id, ptrans_dt, pparticular_id, columnNameUrl, SetMyColumns);

        if ($.fn.DataTable.isDataTable('#thirdLayerTable')) {
            $('#thirdLayerTable').DataTable().destroy();
        }
        var Columns = myColumns;
        

        //$('#thirdLayerTable tbody').empty();
        //$("#thirdLayerTable").css('visibility', 'visible');
        var table = $('#thirdLayerTable').DataTable({
            "destroy": true, 
            "pageLength": 100,
            "ajax": {
                "url": "../Service/GetLoanStatusService.asmx/GetThirdLayerTable",
                "contentType": "application/json",
                "type": "GET",
                "dataType": "JSON",
                "data": function (d) {
                    d.pbranch_id = pbranch_id;
                    d.ptrans_dt = ptrans_dt;
                    d.pparticular_id = pparticular_id;
                    return d;
                },
                "dataSrc": function (json) {
                    json.draw = json.d.draw;
                    json.recordsTotal = json.d.recordsTotal;
                    json.recordsFiltered = json.d.recordsFiltered;
                    json.data = json.d.data;
                    var return_data = json.data;


                    return return_data;
                }
            },
            // "columns": $.parseJSON(localStorage.getItem("Columns")),
            "columns": Columns,
            "columnDefs": [{
                "targets": 0,
                "width": '15%'
            },
            {
                "targets": 1,
                "width": '20%'
            }
            ],
            "processing": true,
            "serverSide": true,
            "deferRender": true,
            //"paging": false,
            "scrollY": "400px",
            scroller: {
                loadingIndicator: true
            },
            "oLanguage": {
                "sLengthMenu": "Show _MENU_ Accounts in each page",
                "zeroRecords": "No account found",
                "infoFiltered": "(filtered from _MAX_ total accounts)"
            },

            "fixedHeader": {
                "header": true,
                "footer": true
            },
        });
        //sessionStorage.clear();
        //localStorage.removeItem('Columns');
        

        // Apply the search
        table.columns().every(function () {
            var that = this;

            $('input', this.header()).on('keyup change clear', function () {
                if (that.search() !== this.value) {
                    that
                        .search(this.value)
                        .draw();
                }
            });
        });

    };

    $("g[aria-labelledby]").hide();


});

function LoadTopTenTable(ptransDt) {
    
    $('#ldg').modal('show');
    $('.modal-backdrop').appendTo('#topTenBody');
    $('body').removeClass();
    $(document).ajaxStop(function () {
        $('#ldg').modal('hide');

    });
    LoadTopTenBorrowerIndv(ptransDt, 0);
   // LoadTopTenBorrowerGrp(ptransDt, 1);
    LoadTopTenNonFunded(ptransDt, 2) 
};
function LoadTopTenBorrowerIndv(ptransDt, poption) {
    var url = "../Service/GetLoanStatusService.asmx/GetTopTenBorrower";
    var parameter = {
        ptransDt: ptransDt,
        poption: poption
    };
    if ($.fn.DataTable.isDataTable('#topTable')) {
        $('#topTable').DataTable().clear().destroy();
    };

    AjaxPostRequest(url, parameter, function (response) {

        var jsonData = JSON.parse(response.d);

        $('#topTable').DataTable({
            "destroy": true, 
            data: jsonData,
            "aaSorting": [],
            "columnDefs": [{
                "orderable": false,
                "targets": 0,
                "width":'5%'
            },
            {
                "orderable": false,
                "targets": 1,
                "width": '60%'
            },
            {
                "orderable": false,
                "targets": 2,
                "className": "text-right"
            }
            ],

            "columns": [{
                "data": "SL"
            },
            {
                "data": "ACCOUNT_TITLE"
            },
            {
                "data": "AMOUNT",
                'render': function (data) {

                    return '<span class=""><b>' + data +'<b> <img width="8%" src="../Theme/banner/bdt.png" /> </span>'
                }
            }
            ],
            "searching": false,
            "paging": false,
            "scrollCollapse": false,
            //"scrollY": "500px",

            "orderable": false,
            "responsive": true,
            "select": true,
            "language": {
                "info": "",

            }
        });
    });
};
function LoadTopTenBorrowerGrp(ptransDt, poption) {
    var url = "../Service/GetLoanStatusService.asmx/GetTopTenBorrower";
    var parameter = {
        ptransDt: ptransDt,
        poption: poption
    };
    if ($.fn.DataTable.isDataTable('#topGroupTable')) {
        $('#topGroupTable').DataTable().clear().destroy();
    }
    AjaxPostRequest(url, parameter, function (response) {
        var jsonData = JSON.parse(response.d);

        $('#topGroupTable').DataTable({
            "destroy": true, 
            data: jsonData,
            "aaSorting": [],
            "columnDefs": [{
                "orderable": false,
                "targets": 0,
                "width": '5%'
            },
            {
                "orderable": false,
                "targets": 1,
                "width": '60%'
            },
            {
                "orderable": false,
                "targets": 2,
                "className": "text-right"
            }
            ],

            "columns": [{
                "data": "SL"
            },
            {
                "data": "ACCOUNT_TITLE"
            },
            {
                "data": "AMOUNT",
                'render': function (data) {

                    return '<span class=""><b>' + data + '<b> <img width="8%" src="../Theme/banner/bdt.png" /> </span>'
                }
            }
            ],
            "searching": false,
            "paging": false,
            "scrollCollapse": false,
            //"scrollY": "500px",

            "orderable": false,
            "responsive": true,
            "select": true,
            "language":
            {
                "processing": "<div class='overlay custom-loader-background'><img src='../Theme/banner/loading.gif'/></div>",
                "loadingRecords": "Loading...",
                "search": "Search:",
                "info": ""
            }
        });
    });
};
function LoadTopTenNonFunded(ptransDt, poption) {
    var url = "../Service/GetLoanStatusService.asmx/GetTopTenBorrower";
    var parameter = {
        ptransDt: ptransDt,
        poption: poption
    };
    if ($.fn.DataTable.isDataTable('#topNonFundedTable')) {
        $('#topNonFundedTable').DataTable().clear().destroy();
    }
   

    AjaxPostRequest(url, parameter, function (response) {
        
        var jsonData = JSON.parse(response.d);
        $('#topNonFundedTable').DataTable({
            "destroy": true, 
            data: jsonData,
            "aaSorting": [],
            "columnDefs": [{
                "orderable": false,
                "targets": 0,
                "width": '5%'
            },
            {
                "orderable": false,
                "targets": 1,
                "width": '60%'
            },
            {
                "orderable": false,
                "targets": 2,
                "className": "text-right"
            }
            ],


            "columns": [{
                "data": "SL"
            },
            {
                "data": "ACCOUNT_TITLE"
            },
            {
                "data": "AMOUNT",
                'render': function (data) {

                    return '<span class=""><b>' + data + '<b> <img width="8%" src="../Theme/banner/bdt.png" /> </span>'
                }
            }
            ],
            "searching": false,
            "paging": false,
            "scrollCollapse": false,
            //"scrollY": "500px",

            "orderable": false,
            "responsive": true,
            "select": true,
            "language": {
                "info": "",
                "processing": "<div class='overlay custom-loader-background'><img src='../Theme/banner/loading.gif' /></div>",
            }
        });

    });
   
};
function LoadThirdLayer(pbranch_id, ptrans_dt, pparticular_id, url, successCallback) {
    $.ajax({
        type: "POST",
        url: url,
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        data: JSON.stringify({
            pbranch_id: pbranch_id,
            ptrans_dt: ptrans_dt,
            pparticular_id: pparticular_id
        }),

        success: successCallback,
        error: function (err) {
            alert("Failed to Load Data");
            //console.log(err);
        }
    });
};



function SetCustomerNo(pbranch_id, ptrans_dt, pparticular_id, url) {
    var parameter = {
        pbranch_id: pbranch_id,
        ptrans_dt: ptrans_dt,
        pparticular_id: pparticular_id
    };
    AjaxPostRequest(url, parameter, function (response) {
        var jsonData = JSON.parse(response.d)[0];
        if (pparticular_id == 1) {
            var customerNumber = jsonData['No of Customers'];
            $('#customersNo').empty();
            $('<strong>' + customerNumber + '</strong>').appendTo($('#customersNo'));
        } else if (pparticular_id == 2) {
            var customerNumber = jsonData['No of Loan Customers'];
            $('#loanCustomerNo').empty();
            $('<strong>' + customerNumber + '</strong>').appendTo($('#loanCustomerNo'));
        } else if (pparticular_id == 3) {
            var customerNumber = jsonData['No of Borrowers'];
            $('#borrowersNo').empty();
            $('<strong>' + customerNumber + '</strong>').appendTo($('#borrowersNo'));
        }

    });


};




function AjaxPostRequest(url, parameters, successCallback) {
    //show loading... image

    $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(parameters),
        contentType: 'application/json;',
        dataType: 'json',
        //beforeSend: function () {
                
        //            $('#loadingModal').modal('show');
                
        //    },
        //    complete: function () {
        //        $('#loadingModal').modal('hide');

        //},
        success: successCallback,
        error: function (err) {
            alert("Failed to Load Data");
            //console.log(err);
        }
    });
}


function PieOfPieChart() {
    // Themes begin
    am4core.useTheme(am4themes_kelly);
    //am4core.useTheme(am4themes_material);
    am4core.useTheme(am4themes_animated);
    var container = am4core.create("pieOfpieChartDiv", am4core.Container);
    container.hideCredits = true;
    container.width = am4core.percent(100);
    container.height = am4core.percent(100);
    container.layout = "horizontal";

    pieOfpieChart = container.createChild(am4charts.PieChart);
    //SetPieOfPieData()
    pieOfpieChart.width = am4core.percent(25);
    pieOfpieChart.radius = am4core.percent(60);


    // Add and configure Series
    var pieSeries = pieOfpieChart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "Qtr_Amount";
    pieSeries.dataFields.category = "Quarter";
    pieSeries.slices.template.states.getKey("active").properties.shiftRadius = 0;
    //pieSeries.labels.template.text = "{category}\n{value.percent.formatNumber('#.#')}%";

    pieSeries.slices.template.events.on("hit", function (event) {
        selectSlice(event.target.dataItem);
    })

    var subchart = container.createChild(am4charts.PieChart);
    subchart.width = am4core.percent(30);
    subchart.radius = am4core.percent(80);

    // Add and configure Series
    var pieSeries2 = subchart.series.push(new am4charts.PieSeries());
    pieSeries2.dataFields.value = "Amount";
    pieSeries2.dataFields.category = "Month";
    pieSeries2.slices.template.states.getKey("active").properties.shiftRadius = 0;
    //pieSeries2.labels.template.radius = am4core.percent(50);
    //pieSeries2.labels.template.inside = true;
    //pieSeries2.labels.template.fill = am4core.color("#ffffff");
    pieSeries2.labels.template.disabled = false;
    pieSeries2.ticks.template.disabled = false;
    pieSeries2.alignLabels = true;
    pieSeries2.events.on("positionchanged", updateLines);

    var interfaceColors = new am4core.InterfaceColorSet();

    var line1 = container.createChild(am4core.Line);
    line1.strokeDasharray = "2,2";
    line1.strokeOpacity = 0.5;
    line1.stroke = interfaceColors.getFor("alternativeBackground");
    line1.isMeasured = false;

    var line2 = container.createChild(am4core.Line);
    line2.strokeDasharray = "2,2";
    line2.strokeOpacity = 0.5;
    line2.stroke = interfaceColors.getFor("alternativeBackground");
    line2.isMeasured = false;

    var selectedSlice;

    function selectSlice(dataItem) {

        selectedSlice = dataItem.slice;

        var fill = selectedSlice.fill;

        var count = dataItem.dataContext.subData.length;
        pieSeries2.colors.list = [];
        for (var i = 0; i < count; i++) {
            pieSeries2.colors.list.push(fill.brighten(i * 2 / count));
        }

        subchart.data = dataItem.dataContext.subData;
        pieSeries2.appear();

        var middleAngle = selectedSlice.middleAngle;
        var firstAngle = pieSeries.slices.getIndex(0).startAngle;
        var animation = pieSeries.animate([{
            property: "startAngle",
            to: firstAngle - middleAngle
        }, {
            property: "endAngle",
            to: firstAngle - middleAngle + 360
        }], 600, am4core.ease.sinOut);
        animation.events.on("animationprogress", updateLines);

        selectedSlice.events.on("transformed", updateLines);

        //  var animation = radiusChart.animate({property:"dx", from:-container.pixelWidth / 2, to:0}, 2000, am4core.ease.elasticOut)
        //  animation.events.on("animationprogress", updateLines)
    }

    function updateLines() {
        if (selectedSlice) {
            var p11 = {
                x: selectedSlice.radius * am4core.math.cos(selectedSlice.startAngle),
                y: selectedSlice.radius * am4core.math.sin(selectedSlice.startAngle)
            };
            var p12 = {
                x: selectedSlice.radius * am4core.math.cos(selectedSlice.startAngle + selectedSlice.arc),
                y: selectedSlice.radius * am4core.math.sin(selectedSlice.startAngle + selectedSlice.arc)
            };

            p11 = am4core.utils.spritePointToSvg(p11, selectedSlice);
            p12 = am4core.utils.spritePointToSvg(p12, selectedSlice);

            var p21 = {
                x: 0,
                y: -pieSeries2.pixelRadius
            };
            var p22 = {
                x: 0,
                y: pieSeries2.pixelRadius
            };

            p21 = am4core.utils.spritePointToSvg(p21, pieSeries2);
            p22 = am4core.utils.spritePointToSvg(p22, pieSeries2);

            line1.x1 = p11.x;
            line1.x2 = p21.x;
            line1.y1 = p11.y;
            line1.y2 = p21.y;

            line2.x1 = p12.x;
            line2.x2 = p22.x;
            line2.y1 = p12.y;
            line2.y2 = p22.y;
        }
    };
    // Enable export
    pieOfpieChart.exporting.menu = new am4core.ExportMenu();
    pieOfpieChart.exporting.menu.items = [{
        "label": "...",
        "menu": [{
            "type": "jpg",
            "label": "JPG"
        },
        // { "type": "pdf", "label": "PDF" },
        {
            "label": "Print",
            "type": "print"
        }
        ]
    }];

    pieOfpieChart.events.on("datavalidated", function () {
        setTimeout(function () {
            selectSlice(pieSeries.dataItems.getIndex(0));
        }, 1000);
    });
};

function LoadSLPieOfPieData(data_row) {
    console.log(data_row.TRANS_DATE);
    console.log(data_row.PARTICULARS_ID);
    var url = "../Service/GetLoanStatusService.asmx/SLGetPieOfPieData";
    var parameter = {
        ptransDt: data_row.TRANS_DATE,
        pparticular_id: data_row.PARTICULARS_ID
    };
    AjaxPostRequest(url, parameter, function (response) {
        var jsonData = JSON.parse(response.d);
        if (jsonData.length != 0) {
            $('#chartInfo').hide();
            $('#pieOfpieChartDiv').show();
            SetPieOfPieData(jsonData);
        } else {
            $('#chartInfo').show();
            $('#pieOfpieChartDiv').hide();
        }
    });
};

function SetPieOfPieData(jsonData) {

    var subDatajson1 = jsonData.filter(element => getMonthFromString(element.Month) <= 3);
    var subDatajson2 = jsonData.filter(element => getMonthFromString(element.Month) > 3 && getMonthFromString(element.Month) <= 6);
    var subDatajson3 = jsonData.filter(element => getMonthFromString(element.Month) > 6 && getMonthFromString(element.Month) <= 9);
    var subDatajson4 = jsonData.filter(element => getMonthFromString(element.Month) > 9 && getMonthFromString(element.Month) <= 12);

    var quarter1 = GetQuarterData(subDatajson1);
    var quarter2 = GetQuarterData(subDatajson2);
    var quarter3 = GetQuarterData(subDatajson3);
    var quarter4 = GetQuarterData(subDatajson4);


    //alert(data_row.FIRST_QTR);
    // Add data
    pieOfpieChart.data = [{
        "Quarter": "First Quarter",
        "Qtr_Amount": quarter1,
        "subData": subDatajson1
    },
    {
        "Quarter": "Second Quarter",
        "Qtr_Amount": quarter2,
        "subData": subDatajson2
    },
    {
        "Quarter": "Third Quarter",
        "Qtr_Amount": quarter3,
        "subData": subDatajson3
    },
    {
        "Quarter": "Fourth Quarter",
        "Qtr_Amount": quarter4,
        "subData": subDatajson4
    }
    ];


};

function GetQuarterData(jsonData) {
    var qtrAmount = 0;
    for (var i = 0, j = jsonData.length; i < j; i++) {
        qtrAmount = jsonData[i].Amount;
    }
    return qtrAmount;
};

function LoadSinglePieData(trns_dt) {
    var url = "../Service/GetLoanStatusService.asmx/GetPieData";
    var parameter = {
        ptransDt: trns_dt
    };
    AjaxPostRequest(url, parameter, function (response) {
        var jsonData = JSON.parse(response.d);
        chart.data = jsonData;
    });
};

function SinglePieChart(jsonData) {
    am4core.useTheme(am4themes_kelly);
    //am4core.useTheme(am4themes_material);
    am4core.useTheme(am4themes_animated);
    // Themes end
    //am4core.destroy();

    chart = am4core.create("chartdiv2", am4charts.PieChart3D);
    //chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.legend = new am4charts.Legend();
    chart.applyOnClones = true;


    var series = chart.series.push(new am4charts.PieSeries3D());
    series.dataFields.value = "AMOUNT";
    series.dataFields.category = "PARTICULARS_NAME";
    series.labels.template.text = "{category}: {value}";

    series.slices.template.tooltipText = "{value.percent.formatNumber('##.0')}%";
    chart.radius = am4core.percent(60);
    //end of pie chart

    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "loanChart";
    chart.exporting.menu.items = [{
        "label": "...",
        "menu": [{
            "type": "jpg",
            "label": "JPG"
        },
        // { "type": "pdf", "label": "PDF" },
        {
            "label": "Print",
            "type": "print"
        }
        ]
    }];


};

function LineChart() {
    var lineChart = am4core.create("chartdiv", am4charts.XYChart);
    lineChart.paddingRight = 20;

    // Add data
    lineChart.data = [{
        "year": "1950",
        "value": -0.307
    }, {
        "year": "1951",
        "value": -0.168
    }, {
        "year": "1952",
        "value": -0.073
    }, {
        "year": "1953",
        "value": -0.027
    }, {
        "year": "1954",
        "value": -0.251
    }, {
        "year": "1955",
        "value": -0.281
    }, {
        "year": "1956",
        "value": -0.348
    }, {
        "year": "1957",
        "value": -0.074
    }, {
        "year": "1958",
        "value": -0.011
    }, {
        "year": "1959",
        "value": -0.074
    }, {
        "year": "1960",
        "value": -0.124
    }, {
        "year": "1961",
        "value": -0.024
    }, {
        "year": "1962",
        "value": -0.022
    }, {
        "year": "1963",
        "value": 0
    }, {
        "year": "1964",
        "value": -0.296
    }, {
        "year": "1965",
        "value": -0.217
    }, {
        "year": "1966",
        "value": -0.147
    }, {
        "year": "1967",
        "value": -0.15
    }, {
        "year": "1968",
        "value": -0.16
    }, {
        "year": "1969",
        "value": -0.011
    }, {
        "year": "1970",
        "value": -0.068
    }, {
        "year": "1971",
        "value": -0.19
    }, {
        "year": "1972",
        "value": -0.056
    }, {
        "year": "1973",
        "value": 0.077
    }, {
        "year": "1974",
        "value": -0.213
    }, {
        "year": "1975",
        "value": -0.17
    }, {
        "year": "1976",
        "value": -0.254
    }, {
        "year": "1977",
        "value": 0.019
    }, {
        "year": "1978",
        "value": -0.063
    }, {
        "year": "1979",
        "value": 0.05
    }, {
        "year": "1980",
        "value": 0.077
    }, {
        "year": "1981",
        "value": 0.12
    }, {
        "year": "1982",
        "value": 0.011
    }, {
        "year": "1983",
        "value": 0.177
    }, {
        "year": "1984",
        "value": -0.021
    }, {
        "year": "1985",
        "value": -0.037
    }, {
        "year": "1986",
        "value": 0.03
    }, {
        "year": "1987",
        "value": 0.179
    }, {
        "year": "1988",
        "value": 0.18
    }, {
        "year": "1989",
        "value": 0.104
    }, {
        "year": "1990",
        "value": 0.255
    }, {
        "year": "1991",
        "value": 0.21
    }, {
        "year": "1992",
        "value": 0.065
    }, {
        "year": "1993",
        "value": 0.11
    }, {
        "year": "1994",
        "value": 0.172
    }, {
        "year": "1995",
        "value": 0.269
    }, {
        "year": "1996",
        "value": 0.141
    }, {
        "year": "1997",
        "value": 0.353
    }, {
        "year": "1998",
        "value": 0.548
    }, {
        "year": "1999",
        "value": 0.298
    }, {
        "year": "2000",
        "value": 0.267
    }, {
        "year": "2001",
        "value": 0.411
    }, {
        "year": "2002",
        "value": 0.462
    }, {
        "year": "2003",
        "value": 0.47
    }, {
        "year": "2004",
        "value": 0.445
    }, {
        "year": "2005",
        "value": 0.47
    }];

    // Create axes
    var categoryAxis = lineChart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.renderer.minGridDistance = 50;
    categoryAxis.renderer.grid.template.location = 0.5;
    categoryAxis.startLocation = 0.5;
    categoryAxis.endLocation = 0.5;

    // Pre zoom
    //lineChart.events.on("datavalidated", function () {
    //    categoryAxis.zoomToIndexes(Math.round(LineChart.data.length * 0.4), Math.round(LineChart.data.length * 0.55));
    //});

    // Create value axis
    var valueAxis = lineChart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.baseValue = 0;

    // Create series
    var series = lineChart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "year";
    series.strokeWidth = 2;
    series.tensionX = 0.77;

    var range = valueAxis.createSeriesRange(series);
    range.value = 0;
    range.endValue = 1000;
    range.contents.stroke = am4core.color("#FF0000");
    range.contents.fill = range.contents.stroke;

    // Add scrollbar
    var scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    lineChart.scrollbarX = scrollbarX;

    lineChart.cursor = new am4charts.XYCursor();
};

function tl_PieOfPieChart() {
    // Themes begin
    am4core.useTheme(am4themes_kelly);
    //am4core.useTheme(am4themes_material);
    am4core.useTheme(am4themes_animated);
    var container = am4core.create("ThirdLayerpieOfpieChartDiv", am4core.Container);
    container.width = am4core.percent(100);
    container.height = am4core.percent(100);
    container.layout = "horizontal";


    tl_pieOfpieChart = container.createChild(am4charts.PieChart);
    //SetPieOfPieData()
    tl_pieOfpieChart.width = am4core.percent(25);
    tl_pieOfpieChart.radius = am4core.percent(60);


    // Add and configure Series
    let pieSeries = tl_pieOfpieChart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "Qtr_Amount";
    pieSeries.dataFields.category = "Quarter";
    pieSeries.slices.template.states.getKey("active").properties.shiftRadius = 0;
    //pieSeries.labels.template.text = "{category}\n{value.percent.formatNumber('#.#')}%";

    pieSeries.slices.template.events.on("hit", function (event) {
        selectSlice(event.target.dataItem);
    })

    var tl_subchart = container.createChild(am4charts.PieChart);
    tl_subchart.width = am4core.percent(30);
    tl_subchart.radius = am4core.percent(80);

    // Add and configure Series
    let pieSeries2 = tl_subchart.series.push(new am4charts.PieSeries());
    pieSeries2.dataFields.value = "Amount";
    pieSeries2.dataFields.category = "Month";
    pieSeries2.slices.template.states.getKey("active").properties.shiftRadius = 0;
    //pieSeries2.labels.template.radius = am4core.percent(50);
    //pieSeries2.labels.template.inside = true;
    //pieSeries2.labels.template.fill = am4core.color("#ffffff");
    pieSeries2.labels.template.disabled = false;
    pieSeries2.ticks.template.disabled = false;
    pieSeries2.alignLabels = true;
    pieSeries2.events.on("positionchanged", updateLines);

    var interfaceColors = new am4core.InterfaceColorSet();

    var line1 = container.createChild(am4core.Line);
    line1.strokeDasharray = "2,2";
    line1.strokeOpacity = 0.5;
    line1.stroke = interfaceColors.getFor("alternativeBackground");
    line1.isMeasured = false;

    var line2 = container.createChild(am4core.Line);
    line2.strokeDasharray = "2,2";
    line2.strokeOpacity = 0.5;
    line2.stroke = interfaceColors.getFor("alternativeBackground");
    line2.isMeasured = false;

    var selectedSlice;

    function selectSlice(dataItem) {

        selectedSlice = dataItem.slice;

        var fill = selectedSlice.fill;

        var count = dataItem.dataContext.subData.length;
        pieSeries2.colors.list = [];
        for (var i = 0; i < count; i++) {
            pieSeries2.colors.list.push(fill.brighten(i * 2 / count));
        }

        tl_subchart.data = dataItem.dataContext.subData;
        pieSeries2.appear();

        var middleAngle = selectedSlice.middleAngle;
        var firstAngle = pieSeries.slices.getIndex(0).startAngle;
        var animation = pieSeries.animate([{
            property: "startAngle",
            to: firstAngle - middleAngle
        }, {
            property: "endAngle",
            to: firstAngle - middleAngle + 360
        }], 600, am4core.ease.sinOut);
        animation.events.on("animationprogress", updateLines);

        selectedSlice.events.on("transformed", updateLines);

        //  var animation = radiusChart.animate({property:"dx", from:-container.pixelWidth / 2, to:0}, 2000, am4core.ease.elasticOut)
        //  animation.events.on("animationprogress", updateLines)
    }

    function updateLines() {
        if (selectedSlice) {
            var p11 = {
                x: selectedSlice.radius * am4core.math.cos(selectedSlice.startAngle),
                y: selectedSlice.radius * am4core.math.sin(selectedSlice.startAngle)
            };
            var p12 = {
                x: selectedSlice.radius * am4core.math.cos(selectedSlice.startAngle + selectedSlice.arc),
                y: selectedSlice.radius * am4core.math.sin(selectedSlice.startAngle + selectedSlice.arc)
            };

            p11 = am4core.utils.spritePointToSvg(p11, selectedSlice);
            p12 = am4core.utils.spritePointToSvg(p12, selectedSlice);

            var p21 = {
                x: 0,
                y: -pieSeries2.pixelRadius
            };
            var p22 = {
                x: 0,
                y: pieSeries2.pixelRadius
            };

            p21 = am4core.utils.spritePointToSvg(p21, pieSeries2);
            p22 = am4core.utils.spritePointToSvg(p22, pieSeries2);

            line1.x1 = p11.x;
            line1.x2 = p21.x;
            line1.y1 = p11.y;
            line1.y2 = p21.y;

            line2.x1 = p12.x;
            line2.x2 = p22.x;
            line2.y1 = p12.y;
            line2.y2 = p22.y;
        }
    }

    tl_pieOfpieChart.exporting.menu = new am4core.ExportMenu();
    tl_pieOfpieChart.exporting.menu.items = [{
        "label": "...",
        "menu": [{
            "type": "jpg",
            "label": "JPG"
        },
        // { "type": "pdf", "label": "PDF" },
        {
            "label": "Print",
            "type": "print"
        }
        ]
    }];

    tl_pieOfpieChart.events.on("datavalidated", function () {
        setTimeout(function () {
            selectSlice(pieSeries.dataItems.getIndex(0));
        }, 1000);
    });
};

function tl_LoadSLPieOfPieData(ptransDt, pparticular_id, pbranch_id) {

    var url = "../Service/GetLoanStatusService.asmx/GetPieOfPieData";
    var parameter = {
        ptransDt: ptransDt,
        pparticular_id: pparticular_id,
        pbranch_id: pbranch_id

    };
    AjaxPostRequest(url, parameter, function (response) {
        var jsonData = JSON.parse(response.d);
        if (jsonData.length != 0) {

            tl_SetPieOfPieData(jsonData);
        } else { }
    });
};

function tl_SetPieOfPieData(jsonData) {

    var subDatajson1 = jsonData.filter(element => getMonthFromString(element.Month) <= 3);
    var subDatajson2 = jsonData.filter(element => getMonthFromString(element.Month) > 3 && getMonthFromString(element.Month) <= 6);
    var subDatajson3 = jsonData.filter(element => getMonthFromString(element.Month) > 6 && getMonthFromString(element.Month) <= 9);
    var subDatajson4 = jsonData.filter(element => getMonthFromString(element.Month) > 9 && getMonthFromString(element.Month) <= 12);

    var quarter1 = GetQuarterData(subDatajson1);
    var quarter2 = GetQuarterData(subDatajson2);
    var quarter3 = GetQuarterData(subDatajson3);
    var quarter4 = GetQuarterData(subDatajson4);

    //alert(data_row.FIRST_QTR);
    // Add data
    tl_pieOfpieChart.data = [{
        "Quarter": "First Quarter",
        "Qtr_Amount": quarter1,
        "subData": subDatajson1
    },
    {
        "Quarter": "Second Quarter",
        "Qtr_Amount": quarter2,
        "subData": subDatajson2
    },
    {
        "Quarter": "Third Quarter",
        "Qtr_Amount": quarter3,
        "subData": subDatajson3
    },
    {
        "Quarter": "Fourth Quarter",
        "Qtr_Amount": quarter4,
        "subData": subDatajson4
    }
    ];


};

function chartInitialize() {
    am4core.useTheme(am4themes_kelly);
    //am4core.useTheme(am4themes_material);
    am4core.useTheme(am4themes_animated);
    PieOfPieChart();
    SinglePieChart();

    //tirdlayer chart initialization
    tl_PieOfPieChart();
}

function getMonthFromString(mon) {
    return new Date(Date.parse(mon + " 1, 2012")).getMonth() + 1
}