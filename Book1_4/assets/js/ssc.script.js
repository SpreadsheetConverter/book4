/* Licensed under the SpreadsheetConverter *//*!
 * ssc.script.js
 */
var ssc=ssc||{};ssc.attachments=[];ssc.pendingUploads=0;ssc.recalcSource='';ssc.APPNAME='Book1_4';ssc.exMsg='The fields with the red border are required.\\\'s'
ssc.Dialog={};ssc.Dialog.BeforeSubmitDesc='The form\\\'s is being submitted.';ssc.Dialog.OfflineHeading='Save until online';ssc.Dialog.OfflineDesc='You are currently offline and the submit failed. Do you want to save the submit and send it later when you are online.';
                ssc.Dialog.OfflineConfirm='Do you want to save?';ssc.Dialog.OfflineSubmitHeading='Offline forms submit confirmation';ssc.Dialog.OfflineSubmitDesc='There are Offline form\\\'s), which are now ready to submit in \\\"server\\\".';ssc.Dialog.OfflineSubmitConfirm='Do you want %to <submit>?';
                ssc.Dialog.FailOfflineHeading='Offline Form submit failed';ssc.Dialog.FailOfflineDesc='Unable to connect to the Internet. Please try submitting the offline forms later in internet connection.';ssc.Dialog.OfflineSubmitWait='It may take sometime to finish all submits depending on the size of offline forms and internet connection.';ssc.Dialog.OfflineSubmitWaitCounter='Left';
     var focused=false;
        $(function(){
            var calendar_dateFormats = {};
            var defaultDateFmt = 'm/d/yyyy';
            postcode();
ssc.active_sheet_selector = 'div.active > div.container-fluid.ssc-responsive-sheet > div.row > section';

$('a').on('click',function (e) {	
				var href = $(this).attr('href');
				if(href.slice(0,1) == '#'){				
					e.preventDefault();						
					var $target = $(href);
					if($target.length == 0){
						alert('Oops! This link is broken so can not navigate.');
						return;
					}
					focused=false;
					ssc.focusOnElement($target);
				}
			});

                ssc.focusOnElement = function(elem){
                    if(focused) return;
                    focused=true;
                    var tab = elem.parents('.tab-pane');
				    if(!tab.hasClass('active')){
					    $('.nav-tabs a[href="#' + tab.attr('id') + '"]').tab('show');
				    }

				    $('html, body').stop().animate(
				    {
					    'scrollTop': elem.offset().top - 40			
				    }, 
				    900, 
				    'swing', 
				    function () {
					    elem.focus();						
				    });
                }
			$('.btn.btn-sm.button-update').click(function(){recalc_onclick('');})
			$('.btn.btn-sm.button-reset').click(function(){resetClick(this);})
			$('.btn.btn-sm.button-print.one').click(function(){printClick(this);})
			$('.btn.btn-sm.button-submit.spin-button').click(function(){submitClick(this);})

$('#trialDialog').modal('show');

			ssc.formSubmitModule.config({url_submit_server: 'https://share.spreadsheetconverter.com/submit/',
                before_onlineformsubmit_callback:function(){
                    $('#onlinefom-submit-conformation-modal').modal('show');
                    ssc.formSubmitModule.submitThisForm(function(){$('#formc').submit();});
                },
                after_onlineformsubmit_callback : function(status,msg){
                    $('#onlinefom-submit-conformation-modal').modal('hide');
                    var $statusModel = $('#onlineform-submit-status-modal');
                    if(status === 'error'){$statusModel.find('.modal-title').text('Submit Fail.');
                        $statusModel.find('.modal-body p').text(msg);
                        $statusModel.find('.modal-body .status-icon').removeClass('glyphicon-ok-circle').addClass('glyphicon-warning-sign').css('color','rgb(198,0,0)');
                        $statusModel.modal('show');}
                    //else{
                    else if($('#xl_redirect_success').length > 0 || false){
                        ssc.Spinner.showModalSpinner();
                            if($('#xl_redirect_success').length > 0){ 
                                var url_ = $('#xl_redirect_success').val();
                                url_+=(url_.indexOf('paypal')>-1)?'':'';
                                window.location.href  = url_;
                            }else{
                                window.location.href  = '';
                            }  
                   }else{
                    $statusModel.find('.modal-title').text('Submit/sub \\\'Successful\\\'.');
                    $statusModel.find('.modal-body p').text('The form\\\'s was\\\\successfully \\\"submitted\\\".');
                    $statusModel.find('.modal-body .status-icon').removeClass('glyphicon-warning-sign warn-icon').addClass('glyphicon-ok-circle').css('color','rgb(53, 197, 21)');             
                    $statusModel.modal('show');
                    if(ssc.attachments.length > 0){
                    	$('input[type=file]').parents('td').find('.uploading').find('ul').find('li').each(function(){ $(this).data('ssc_fileuploader').destroy();});
                    }

                   } 
                   //}
                },after_offlineformsubmit_callback : function(status){
                    if( status ==='success') {
                        $('#offlineforms-submit-conformation-yes-btn').button('reset');
                        $('#offlineforms-submit-conformation-modal').modal('hide');
                        $('body').removeClass('modal-open');
                        $('.modal-backdrop').remove();
                        if(ssc.attachments.length > 0){
                            $('input[type=file]').parents('td').find('.uploading').find('ul').find('li').each(function(){ $(this).data('ssc_fileuploader').destroy();});
                        }
                    }else if(status === 'error'){
                        $('#offlineforms-submit-conformation-modal .info').text('Submit error: Please try later.');
                        $('#offlineforms-submit-conformation-modal .conform').text('');
                        $('#offlineforms-submit-conformation-yes-btn').hide();
                        $('#offlineforms-submit-conformation-modal .btn-link').text('close');
                        $('#offlineforms-submit-conformation-modal .btn-link').show();
                    }}});
            var focusCtrl=$('input:not(":hidden,:button,[readonly=readonly],:disabled"),select,a.ui-slider-handle,textarea,a.ui-state-active');
			                //to prevent popup dialog to appear in page load.
			                if(focusCtrl!= undefined && focusCtrl.filter(':first').hasClass('form-control')==false){
				                focusCtrl.filter(':first').focus();
			                }
                            //To make readonly elements background transparent
                            $('input[type=text][readonly]').css('background','transparent');
        });
ssc.checkIfMSIE = function() {
            var a = window.navigator.userAgent,
                b = a.indexOf('MSIE '),
                c = a.indexOf('.NET CLR');
            return !(-1 === b && -1 === c)
        };

            function showValidateMessage(message,title){
                if(toastr){if(title && title.length>0){toastr.error(message,title);}else{toastr.error(message);}}else{alert(message);}
            }
function resetClick(){
    if(ssc !== undefined && ssc.realtimesync !== undefined){
        if(ssc.realtimesync.connection !== undefined){
            ssc.realtimesync.connection.close();ssc.realtimesync.connected=false;
            ssc.realtimesync.ShowDisconnectAlert($('.toolbar-panel-right'));}}
            document.formc.reset();
            postcode();
            
            LoadFromQueryString();
            recalc_onclick('reset');
        }


var co = new Object;
function recalc_onclick(ctl) {ssc.recalcSource = ctl;
  if (true) {


co['XLEW_1_4_2']=eeparseFloat(document.getElementById('XLEW_1_4_2').value);co['XLEW_1_5_2']=eeparseFloat(document.getElementById('XLEW_1_5_2').value);calc(co);if(ssc !== undefined && ssc.realtimesync !== undefined && ssc.realtimesync.connection !== undefined && ssc.realtimesync.connection.readyState == 1){ssc.realtimesync.coUpdate(co,ctl);}else if(ssc !== undefined && ssc.realtimesync !== undefined && ssc.realtimesync.wsUrl && ssc.realtimesync.IsCloseByError && !ssc.realtimesync.IsErrorMsgDialogShown){if(!alert('Realtime-Sync is Disconnected, This Form will not save in server and will not collaborate with your partner.')){ssc.realtimesync.IsErrorMsgDialogShown = true;}}document.getElementById('XLEW_1_6_2').value=eedisplayFloat(co['XLEW_1_6_2']);
};};
var arr1xB4B5=new Array(2);for(var ii=0;ii<2;ii++){arr1xB4B5[ii]=new Array(1);for(var jj=0;jj<1;jj++){arr1xB4B5[ii][jj]=0}};var eecm1=new Array(new Array(arr1xB4B5,0,0,1,0));function calc(data){arr1xB4B5[1][0]=data['XLEW_1_5_2'];arr1xB4B5[0][0]=data['XLEW_1_4_2'];var c1B6=(sumgeneral(2,0,0,eecm1));data['XLEW_1_6_2']=c1B6;};
function postcode() {
};
function TriggerOnchange(hiddenId)
{
    var e = jQuery.Event('change');
    $('#'+hiddenId).trigger(e);
}
var eeisus=1;var eetrue="TRUE";var eefalse="FALSE";var eedec=".";var eeth=",";var eedecreg=new RegExp("\\.","g");var eethreg=new RegExp(",","g");var eecurrencyreg=new RegExp("[$]","g");var eepercentreg=new RegExp("%","g");
function myIsNaN(x){return(isNaN(x)||(typeof x=='number'&&!isFinite(x)));};

function round(n,nd){if(isFinite(n)&&isFinite(nd)){var sign_n=(n<0)?-1:1;var abs_n=Math.abs(n);var factor=Math.pow(10,nd);return sign_n*Math.round(abs_n*factor)/factor;}else{return NaN;}};

function sum2(arr,rt,rb){var sum=0;for(var ii=rt;ii<=rb;ii++){sum+=arr[ii]};return sum};function sum3(arr,rt,ct,rb,cb){var sum=0;for(var ii=rt;ii<=rb;ii++){for(var jj=ct;jj<=cb;jj++){sum+=arr[ii][jj]}};return sum};

function sumgeneral(cnt,vsum,vcnt,x){var sum=vsum;for(var ii=0;ii<x.length;ii++){sum+=sum3(x[ii][0],x[ii][1],x[ii][2],x[ii][3],x[ii][4]);};return sum;};

function eeparseFloat(str){str=String(str).replace(eedecreg,".");var res=parseFloat(str);if(isNaN(res)){return 0;}else{return res;}};

var near0RegExp=new RegExp("[.](.*0000000|.*9999999)");function eedisplayFloat(x){if(myIsNaN(x)){return Number.NaN;}else{var str=String(x);if(near0RegExp.test(str)){x=round(x,8);str=String(x);}return str.replace(/\./g,eedec);}};
function submitClick(obj) {focused=false;recalc_onclick('submit'); if(ssc.pendingUploads > 0) {alert('Please wait until all attachments have finished uploading.'); return false;}var errors = $('.error').filter(':hiddenByParent').length;
                                                if(errors > 0) { showValidateMessage('The fields with the red border are invalid! '+errors+(errors>1?' errors':' error'), 'Form validation'); if(typeof(ssc.focusOnElement) == 'function'){ssc.focusOnElement($('.error').first());} return false; }if(ssc.Global.formStorage){
                    if (!ssc.utils.checkIfBrowserSupportStorageSystem() || !Modernizr.indexeddb) $('#formc').submit();
                    else{
                        var spin_submit = ssc.Spinner.create($(obj));
                        spin_submit.start();
                        ssc.formSubmitModule.callIfOnlineElse(function(){spin_submit.stop();ssc.formSubmitModule.options.before_onlineformsubmit_callback();}, function (){spin_submit.stop();
                            ssc.formSubmitModule.showOfflineConformationDialog();
                        });}}else $('#formc').submit();}
function printClick(){
           recalc_onclick('');		  
           $('#printAllTheme').remove();
           window.print();
		}
function LoadFromQueryString() {var queryStrings = decodeURI(document.location.search), _readonly = !1;queryStrings.indexOf("_readonly") > -1 && (_readonly = !0), queryStrings.length > 0 && $.each(queryStrings.substr(1).split("&"), function (c, q) {var aQueryString = q.split("=");if (2 == aQueryString.length) {var key = aQueryString[0].toString(), value = aQueryString[1].toString();ssc.formBinder.bind(key,value);}})}
function navigate(e){var t=e.keyCode|e.which;if(t!=13&&t!=40&&t!=38)return;var n=$(e.target||e.srcElement);if(n.is("textarea"))return;if(n.is("select")&&(t==38||t==40))return;var r=parseInt(n.attr("data-sheet"),10);var i=parseInt(n.attr("data-row"),10);var s=parseInt(n.attr("data-col"),10);var o=false;var u=$("#sheet-"+r+"");var a='input:not(":hidden,:button,[readonly=readonly],:disabled"),select,a.ui-slider-handle,textarea';var f=i+1;var l=i-1;var c=f;var h=l;while(t==40&&f<=c||t==38&&l>=h){var p=u.find(a).filter("[data-sheet="+r+"][data-row="+(t==38?l:f)+"][data-col="+s+"]");if(p.length>0){p.focus();if(p.is("input:text, textarea"))p.select();o=true;break}else{var d;if(u.data("col"+s)==undefined){d=u.find(a).filter("[data-sheet="+r+"][data-col="+s+"]").map(function(){return parseInt($(this).attr("data-row"),10)}).toArray();u.data("col"+s,d)}else{d=u.data("col"+s)}c=d[d.length-1];h=d[0];var v="indexOf"in Array.prototype?d.indexOf(i):$.inArray(i,d);if(t==40&&i<c){f=d[v+1]}else if(t==38&&i>h){l=d[v-1]}else{break}}}if(!o){var m;if(t==38)m=parseInt(n.attr("tabindex"),10)-1;else m=parseInt(n.attr("tabindex"),10)+1;var g=u.find(a).filter("[data-sheet][data-row][data-col][tabindex="+m+"]");if(g.length>0){if(g.is(":radio"))g=g.filter(":checked");if(g.length>0){g.focus();if(g.is("input:text, textarea"))g.select()}}else{var y=u.find(a).filter("[data-sheet][data-row][data-col][tabindex]:first");y.focus();if(y.is("input:text, textarea"))y.select()}}e.preventDefault?e.preventDefault():e.returnValue=false}
/* Finds out if the element is hidden by its parent tr */
                    jQuery.expr[':'].hiddenByParent = function(a) {
                        /* Skip the hidden form elements */
                        if(a.id.startsWith('xl_')) return true;

                        var isHiddenByParent=false;        
                        var elem = $(a);
                        if(elem !=undefined)
                        {
                            /* if the row is hidden */
                            isHiddenByParent = elem.closest("tr[class^='_css']").css('display') != 'none';
                        }

                        if(isHiddenByParent == true)
                        {
                            /* if whole tab is hidden */
                            isHiddenByParent = elem.closest('.tab-pane>div').css('display') != 'none';
                        }
                        return isHiddenByParent;                        
                    };var ssccf1n = function(op,id,css,data1){	
	                switch(op)
	                {
                        						case 'image':                               
                            $('#' + id).attr('src',$('#'+data1).attr('src'));
                        break;
      		
	                }
                }; 
                var ssccf4n = function(op,id,colors,data1,data2,data3,data4){
                    switch(op)
                    {
                           
                    }
                };

