
// Initialize your app
var myApp = new Framework7({
    modalTitle: 'My App',
 
    // If it is webapp, we can enable hash navigation:
    pushState: true,
    material:true,
    popover: {
    closeByBackdropClick: true,
  },
    // Hide and show indicator during ajax requests
    onAjaxStart: function (xhr) {
        myApp.showIndicator();
    },
    onAjaxComplete: function (xhr) {
        myApp.hideIndicator();
    }
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
   // dynamicNavbar: true,
    domCache: true // write by Nikita
});

$( document ).ready(function() {  
    document.addEventListener("deviceready", checkStorage, false); 
    document.addEventListener("backbutton", onBackKeyDown, false);
     
 });
 
function onBackKeyDown() {
       var page=myApp.getCurrentView().activePage; myApp.hidePreloader(); 
       //alert(page.name);
      if(page.name=="login-screen"){
           myApp.confirm('Do you want to Exit !', function () {
                  navigator.app.clearHistory(); navigator.app.exitApp();
            });
       } 
       else
       { 
          $$(".back").click();
       }
}

//-------- CHECK INTERNET CONNECTION ------------
function checkConnection() {
    var networkState = navigator.connection.type;
    //alert(networkState);
    if(networkState=='none')
    {  
        mainView.loadPage("internet.html");
    }

}

function checkStorage()
{ 
   checkConnection();
   //alert("in sabzi func");
   var value = window.localStorage.getItem("login_session");
   if(value==null) 
   {
     mainView.loadPage("index.html");
   }else{
     mainView.loadPage("dashboard.html");
   }
}

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('about', function (page) {
    // run createContentPage func after link was clicked
   /* $$('.create-page').on('click', function () {
        createContentPage();
    });*/
 //alert('About page loaging...!!!');

var cnt =page.query.count;

var txt='';
for (var i=1; i<cnt; i++) {
    txt+="<br/>No "+i;
};

$$(page.container).find('.about_data').append(txt);
});

// Generate dynamic page
var dynamicPageIndex = 0;
function createContentPage() {
	mainView.router.loadContent(
        '<!-- Top Navbar-->' +
        '<div class="navbar">' +
        '  <div class="navbar-inner">' +
        '    <div class="left"><a href="#" class="back link"><i class="icon icon-back"></i><span>Back</span></a></div>' +
        '    <div class="center sliding">Dynamic Page ' + (++dynamicPageIndex) + '</div>' +
        '  </div>' +
        '</div>' +
        '<div class="pages">' +
        '  <!-- Page, data-page contains page name-->' +
        '  <div data-page="dynamic-pages" class="page">' +
        '    <!-- Scrollable page content-->' +
        '    <div class="page-content">' +
        '      <div class="content-block">' +
        '        <div class="content-block-inner">' +
        '          <p>Here is a dynamic page created on ' + new Date() + ' !</p>' +
        '          <p>Go <a href="#" class="back">back</a> or go to <a href="services.html">Services</a>.</p>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>'
    );
	return;
}


/*---------- code by Nikita --------*/
$$(document).on('pageInit', function (e){
    // do something here when page loaded
    //alert('page loaging.....');
    checkConnection();
    //var page = e.detail.page;
    
    //var si_username = window.localStorage.getItem("login_session");
   // alert(page.name+"si_username:"+si_username);
    //var si_username = window.localStorage.getItem("login_session");
    
    /*if(si_username==null){
        //alert('login');
        //window.localStorage.removeItem("login_session"); 
        if(page.name!="login-screen"){
         window.location.href="index.html";
       }
        //mainView.loadPage("index.html");
      }else{
        // alert('dashboard');
        mainView.loadPage("dashboard.html");
      }*/

    
});

myApp.onPageInit('dashboard', function (page) {
    checkConnection();
  var si_username = window.localStorage.getItem("login_session");
    var base_url='http://starprojects.in/dairy/app/';
    var output='';
   
  //alert("incccccccc");
    
    $$.ajax({
             url  : base_url+'dashboard/'+si_username,
             dataType:'json',
             success: function(myres) {
             // alert("in"+myres);
               // console.log(myres);
                $('.ttl_order').html(myres.ttl_order);
                $('.ttl_today_order').html(myres.ttl_today_order);
              } 
            });
});

myApp.onPageInit('profile', function (page) {
  var si_username = window.localStorage.getItem("login_session");
    var base_url='http://starprojects.in/dairy/app/';
    var output='';
   
  //alert("incccccccc");
    myApp.showPreloader();
    $$.ajax({
             url  : base_url+'profile/'+si_username,
             dataType:'json',
             success: function(myres) {
             // alert("in"+myres);
               // console.log(myres);

                $('.name').html(myres[0]['name']);
                $('.code').html(myres[0]['code']);
                $('.city').html(myres[0]['c_city']);
                $('.area').html(myres[0]['c_area_code']);
                $('.mobile_no').html(myres[0]['c_mob']);
                $('.phone_1').html(myres[0]['c_phone_1']);
                $('.phone_2').html(myres[0]['c_phone_2']);
                $('.email').html(myres[0]['c_email']);
                $('.c_persone').html(myres[0]['c_contact_person']);
                $('.category').html(myres[0]['c_cust_category_code']);
                $('.add_1').html(myres[0]['c_add_1']);
                $('.add_2').html(myres[0]['c_add_2']);
                $('.add_3').html(myres[0]['c_add_3']);
                $('.pan_num').html(myres[0]['c_panno']);
                $('.c_gstin_no').html(myres[0]['c_gstin_no']);
                $('.c_gstin_type').html(myres[0]['c_gstin_type']);
               
               
              } 
            });
    myApp.hidePreloader();
});
/*$$(document).on('pageInit','.page[data-page="about"]', function (e){
    // do something here when page loaded
   alert('About page loaging...');
  
});*/
//================= LOGOUT =================
function logout_fun()
{
    checkConnection();
    window.localStorage.removeItem("login_session"); 
    mainView.loadPage("index.html");
}
//================= LOGIN PAGE ==============
function checklogin(){
    checkConnection();
    var form = $(".loginForm").serialize();
    var base_url='http://starprojects.in/dairy/app/';
    //alert(form);

    
    myApp.showPreloader();
          $$.ajax({
             type: 'POST',
             url  : base_url+'chklogin',
             data: form,
             cache: false,
             success: function(res) {
                //alert(res);
                 if(res!='')
                 {
                    // alert("success");
                    window.localStorage.setItem("login_session", res);
                    mainView.loadPage("dashboard.html");
                 }
                 else
                 {
                    
                     myApp.addNotification({
                            message: 'Please Enter a Valid Data.'
                        });
                 }
              }
            });
     myApp.hidePreloader();

}

//================= Change Password ==============
function change_password(){
    checkConnection();
    var form = $(".changepassForm").serialize();
    var base_url='http://starprojects.in/dairy/app/';
    var si_username = window.localStorage.getItem("login_session");
    //alert(form);
    var new_pass=$('.new_pass').val();
    var conf_pass=$('.conf_pass').val();
    if(new_pass != conf_pass){
      myApp.addNotification({
                            message: 'Confirm password not match.'
                        });

    }else{
    
    myApp.showPreloader();
          $$.ajax({
             type: 'POST',
             url  : base_url+'change_password/'+si_username,
             data: form,
             cache: false,
             success: function(res) {
                //alert(res);
                 if(res=='success')
                 {
                    
                     myApp.addNotification({
                            message: '<strong>Success! </strong> Password has been changed.'
                        });
                    mainView.loadPage("profile.html");
                 }
                 else if(res=='fail')
                 {
                    
                     myApp.addNotification({
                            message: 'Old password is wrong. Please try again.'
                        });
                 }
                 else
                 {
                    
                     myApp.addNotification({
                            message: 'Please Enter a Valid Data.'
                        });
                 }
              }
            });
     myApp.hidePreloader();
   }

}

//============== PLACE ORDER ========
myApp.onPageInit('place_order', function (page) {
    checkConnection();
    var si_username = window.localStorage.getItem("login_session");
    var base_url='http://starprojects.in/dairy/app/';
    var output='';
    //var tomorrow = new Date.today().addDays(1).toString("dd-mm-yyyy"); 
   // alert(tomorrow);
    $('.customer_code').val(si_username);
    $$.ajax({
             //type: 'POST',
             url  : base_url+'product_list',
             dataType:'json',
             success: function(arrlist) {
                
                $('.order_date_add').html("ORDER DATE : "+arrlist.OrderDate);
                //var name=myres.name; 

                //name=myres['name'];
               // alert(myres);
                /*output  +='<li class="item-content">'
                                +'<div class="item-inner">'
                                +'<div class="item-title label">Order Date </div>'
                                +'<div class="input">'
                                +'<input type="text" value="'+tomorrow+'" readonly>'
                                +'</div>'
                                +'</div>'
                                +'</li>';*/
                for(var i = 0; i < arrlist.product.length; i++){
                      var myres=arrlist.product;
                      //alert(output);
                      var no=i+1;
                        output  +='<li class="item-content">'
                                +'<div class="item-inner">'
                                +'<div class="item-title font-13">'+no+'. '+myres[i]['name']+'</div>'
                                +'<div class="input">'
                                +'<input type="number" style="border:1px solid gray;width:75px;" name="product['+myres[i]['code']+']" class="p_qty" onkeyup="calculateSum()" min="1" autocomplete="off">'
                                +'</div>'
                                +'</div>'
                                +'</li>';
                    }
                    output  +='<li class="item-content">'
                                +'<div class="item-inner">'
                                +'<div class="item-title label font-600">TOTAL ORDER:</div>'
                                +'<div class="input total_order font-600">'
                                +'</div>'
                                +'</div>'
                                +'</li>';
                    output  +='<li class="item-content">'
                                +'<div class="item-inner">'
                                +'<div class="item-title label font-600">TOTAL CRATES:</div>'
                                +'<div class="input total_crates font-600">'
                                +'</div>'
                                +'</div>'
                                +'</li>';
                    /*output  +='<li class="item-content">'
                                +'<div class="item-inner">'
                                +'<div class="item-title label"></div>'
                                +'<div class="input">'
                                +'<div class="button-connect"> <a href="#" class="button button-fill  button-big" onclick="add_order();">Place Order</a> </div>'
                                +'</div>'
                                +'</div>'
                                +'</li>';*/
                    output +='<li class = "item-content"><div class = "item-inner"><div class = "item-input"><div class="button-connect"><a href = "#" class = "button button-fill  button-big btn-olive" onclick="add_order();">Place Order</a></div></div></div></li>';
                  //  alert(output);
                  $('.product_list').append(output);

              }
            });
});

//=========== Edit order ================
//============== PLACE ORDER ========
myApp.onPageInit('edit_order', function (page) {
    checkConnection();
    var si_username = window.localStorage.getItem("login_session");
    var base_url='http://starprojects.in/dairy/app/';
    var order_code=page.query.order_code;
    var output='';
    //alert(order_code);
    //var tomorrow = new Date.today().addDays(1).toString("dd-mm-yyyy"); 
   // alert(tomorrow);
    $('.order_code_edit').html(order_code);
    
     $('.view_order_link').html('<a href="view_order.html?order_code='+order_code+'" class="link icon-only bacl"><i class="icon icon-back"></i></a>');
    $('.customer_code').val(si_username);
    $$.ajax({
             //type: 'POST',
             url  : base_url+'edit_order_data/'+order_code,
             dataType:'json',
             success: function(arrlist) {
                    $('.order_date_edit').html("ORDER DATE : "+arrlist.OrderDate);
                   output+='<input type="hidden" name="order_code" value="'+order_code+'">';
                var ttl=0; var ttl_Crt=0;
                for(var i = 0; i < arrlist.product.length; i++){
                var myres=arrlist.product;
                  var no=i+1;
                    if(myres[i]['qty']!=null && myres[i]['qty']!=""){
                    var qty=myres[i]['qty'];
                     ttl+=parseFloat(qty);
                    ttl_Crt+=Math.round(parseFloat(qty));
                    }else{
                     var qty="";
                    }

                   

                        output  +='<li class="item-content">'
                                +'<div class="item-inner">'
                               +'<div class="item-title font-13">'+no+'. '+myres[i]['name']+'</div>'
                                +'<div class="input">'
                                +'<input type="text" style="border:1px solid gray;width:75px;" name="product1['+myres[i]['code']+']" value="'+qty+'" class="p_qty" onkeyup="calculateSum()" min="1" autocomplete="off">'
                                +'</div>'
                                +'</div>'
                                +'</li>';
                    }
                    output  +='<li class="item-content">'
                                +'<div class="item-inner">'
                                +'<div class="item-title label">Total Order:</div>'
                                +'<div class="input total_order">'+ttl
                                +'</div>'
                                +'</div>'
                                +'</li>';
                    output  +='<li class="item-content">'
                                +'<div class="item-inner">'
                                +'<div class="item-title label">Total Crates:</div>'
                                +'<div class="input total_crates">'+ttl_Crt
                                +'</div>'
                                +'</div>'
                                +'</li>';
                    /*output  +='<li class="item-content">'
                                +'<div class="item-inner">'
                                +'<div class="item-title label"></div>'
                                +'<div class="input">'
                                +'<div class="button-connect"> <a href="#" class="button button-fill  button-big" onclick="edit_order();">Place Order</a> </div>'
                                +'</div>'
                                +'</div>'
                                +'</li>';*/
                    output +='<li class = "item-content"><div class = "item-inner"><div class = "item-input"><div class="button-connect"><a href = "#" class = "button button-fill  button-big btn-olive" onclick="edit_order();">Save Changes</a></div></div></div></li>';

                  //  alert(output);
                  $('.edit_product_list').append(output);
                //calculateSum();

              }
            });
});

//==========================================
//============== VIEW ORDER ========
myApp.onPageInit('view_order', function (page) {
    checkConnection();
    var si_username = window.localStorage.getItem("login_session");
    var base_url='http://starprojects.in/dairy/app/';
    var order_code=page.query.order_code;
    var output='';
    //alert(order_code);
    //var tomorrow = new Date.today().addDays(1).toString("dd-mm-yyyy"); 
   // alert(tomorrow);

    //$('.customer_code').val(si_username);
    $('.order_code_view').html(order_code);
    $('.edit_order_link').html('<a href="edit_order.html?order_code='+order_code+'" class="link icon-only"><i class="fa fa-pencil-square-o"></i></a>');
    
    $$.ajax({
             //type: 'POST',
             url  : base_url+'view_order/'+order_code,
             dataType:'json',
             success: function(myres) {
                   
                   

                  output+='<div class="data-table data-table-init card">'
                            +'<div class="card-header bg-light-card font-600 color-white"><div class="data-table-title font-15">ORDER DATE: '+myres[0]['order_date1']+'<br/>CREATE ON: '+myres[0]['order_place_date1']+'</div></div>'
                            +'<table>'
                              +'<thead>'
                                +'<tr>'
                                  +'<th class="checkbox-cell font-600">No.</th>'
                                  +'<th class="label-cell font-600">PRODUCT NAME</th>'
                                 +' <th class="numeric-cell font-600">QTY</th>'
                               +' </tr>'
                              +'</thead>'
                              +'<tbody>';
                var ttl=0; var ttl_Crt=0;
                for(var i = 0; i < myres.length; i++){
                //alert(qty);
                var no=i+1;
                    if(myres[i]['qty']!=null && myres[i]['qty']!=""){
                    var qty=myres[i]['qty'];
                    
                    }else{
                     var qty="";

                    }
                    ttl+=parseFloat(qty);
                    ttl_Crt+=Math.round(parseFloat(qty));

                    output+='<tr><td class="checkbox-cell">'+no+'.</td>'
                              +'<td class="label-cell">'+myres[i]['p_name']+'</td>'
                              +'<td class="numeric-cell">'+qty+'</td></tr>';
                    }
                    output+='<tr><td class="checkbox-cell"></td>'
                              +'<td class="numeric-cell font-600">TOTAL: </td>'
                              +'<td class="numeric-cell font-600">'+ttl+'</td></tr>';
                    output+='<tr><td class="checkbox-cell"></td>'
                              +'<td class="numeric-cell font-600">TOTAL CRATES: </td>'
                              +'<td class="numeric-cell font-600">'+ttl_Crt+'</td></tr>';
                    output+='</tbody></table></div>';
                    
                     $(".ttlcnt_edit").html(ttl+" | "+ttl_Crt+" ");
                  //  alert(output);
                  $('.view_order_info').append(output);
                
              }
            });
});

//==========================
function calculateSum() {

    var sum = 0; var crates = 0;
    $(".p_qty").each(function() {
    //add only if the value is number
    if(!isNaN(this.value) && this.value.length!=0) {
    sum += parseFloat(this.value);
    crates += Math.round(parseFloat(this.value));
    }
    });
    //.toFixed() method will roundoff the final sum to 2 decimal places
    $(".total_order").html(sum.toFixed(2));
    $(".total_crates").html(Math.round(crates.toFixed(2)));
    $(".ttlcnt").html(sum.toFixed(2)+" | "+Math.round(crates.toFixed(2))+" ");
}

function add_order(){
    checkConnection();
    var form = $(".orderForm").serialize();
    var base_url='http://starprojects.in/dairy/app/';
    //alert(form);
    myApp.showPreloader();
          $$.ajax({
             type: 'POST',
             url  : base_url+'add_order',
             data: form,
             cache: false,
             success: function(res) {
                //alert(res);
                if(res!='')
                 {
                    mainView.loadPage("order_mgt.html");
                      myApp.addNotification({
                            message: 'Place order successfully.'
                        });
                    
                 }
                 
              }
            });
     myApp.hidePreloader(); 
}

function edit_order(){
    checkConnection();
    var form = $(".orderEditForm").serialize();
    var base_url='http://starprojects.in/dairy/app/';
    //alert(form);
    myApp.showPreloader();
          $$.ajax({
             type: 'POST',
             url  : base_url+'edit_order',
             data: form,
             cache: false,
             success: function(res) {
               // alert(res);
                if(res!='')
                 {
                    mainView.loadPage("order_mgt.html");
                    myApp.addNotification({
                        message: 'Edit order successfully.'
                    });
                    
                 }
                 
              }
            });
     myApp.hidePreloader(); 
}

//============== ORDER MGT ========
myApp.onPageInit('order_mgt', function (page) {
    checkConnection();
    var si_username = window.localStorage.getItem("login_session");
    var base_url='http://starprojects.in/dairy/app/';
    var output='';
    //var tomorrow = new Date.today().addDays(1).toString("dd-mm-yyyy"); 
   // alert(tomorrow);
    $('.customer_code').val(si_username);
    $$.ajax({
             //type: 'POST',
             url  : base_url+'order_mgt/'+si_username,
             dataType:'json',
             // type: 'POST',
             //data:{'customer_code':si_username},
             success: function(myres) {
                //alert(myres);
                $('.total_order_counts').html("TOTAL ORDERS : "+myres.length);
                for(var i = 0; i < myres.length; i++){
                    /*output  +='<li class="accordion-item"><a href="#" class="item-content item-link">'
                            +'<div class="item-inner">'
                            +'<div class="item-title">ORDER CODE #'+myres[i]['order_code']+'</div>'
                            +'<div class="item-after font-13">'+myres[i]['order_date1']+'</div></div></a>'
                            +'<div class="accordion-item-content">'
                            +'<div class="content-block">'
                            +'<p>Total Crates: '+myres[i]['cnt']+'</p>'
                            +'<p class="buttons-row">'
                            +'<a href="edit_order.html?order_code='+myres[i]['order_code']+'" class="button button-raised button-fill color-blue"> Edit</a>'
                            +'<a href="#" class="button button-raised button-fill color-green"> View</a>'
                            +'<a href="#" class="button button-raised button-fill color-teal"> History</a>'
                            +'</p>'
                            +'</div>'
                            +'</div>'
                            +'</li>';*/
                      output  +='<li class=""><a href="view_order.html?order_code='+myres[i]['order_code']+'" class="item-content item-link">'
                            +'<div class="item-inner">'
                            +'<div class="item-title">ORDER CODE #<strong>'+myres[i]['order_code']+'</strong></div>'
                            +'<div class="item-after font-13">'+myres[i]['order_date1']+'</div></div></a>'
                            +'<div class="accordion-item-content">'
                            +'<div class="content-block">'
                            +'<p>Total Crates: '+myres[i]['cnt']+'</p>'
                            +'<p class="buttons-row">'
                            +'<a href="edit_order.html?order_code='+myres[i]['order_code']+'" class="button button-raised button-fill color-blue"> Edit</a>'
                            +'<a href="#" class="button button-raised button-fill color-green"> View</a>'
                            +'<a href="#" class="button button-raised button-fill color-teal"> History</a>'
                            +'</p>'
                            +'</div>'
                            +'</div>'
                            +'</li>';
                     /* output  +='<tr><a href="view_order.html?order_code='+myres[i]['order_code']+'" class="item-content item-link"> '
                              +'<td class="label-cell"><strong>'+myres[i]['order_code']+'</strong></td>'
                              +'<td class="numeric-cell">'+myres[i]['order_date1']+'</td>'
                              +'<td class="numeric-cell">'+myres[i]['cnt']+'</td>'
                              +'</a></tr>';*/
                }
                    
                $('.order_list').append(output);

              }
            });
});