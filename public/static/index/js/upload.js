accessid = '';
accesskey = '';
host = '';
policyBase64 = '';
signature = '';
callbackbody = '';
filename = '';
key = '';
expire = 0;
g_object_name = '';
now = timestamp = Date.parse(new Date()) / 1000;
function send_request()
{
    var xmlhttp = null;
    if (window.XMLHttpRequest)
    {
        xmlhttp=new XMLHttpRequest();
    }
    else if (window.ActiveXObject)
    {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (xmlhttp!=null)
    {
        serverUrl = './index.php/index/Oss/getOssPolicy';
        xmlhttp.open( "GET", serverUrl, false );
        xmlhttp.send( null );
        return xmlhttp.responseText;
    }
    else
    {
        alert("Your browser does not support XMLHTTP.");
    }
}
function get_signature()
{
    //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
    now = timestamp = Date.parse(new Date()) / 1000;
    if (expire < now + 3)
    {
        body = send_request();
        var obj = eval ("(" + body + ")");
        host = obj['host'];
        policyBase64 = obj['policy'];
        accessid = obj['accessid'];
        signature = obj['signature'];
        expire = parseInt(obj['expire']);
        callbackbody = obj['callback'];
        key = obj['dir'];
        return true;
    }
    return false;
}
function get_suffix(filename) {
    pos = filename.lastIndexOf('.');
    suffix = '';
    if (pos != -1) {
        suffix = filename.substring(pos)
    }
    return suffix;
}
function calculate_object_name(filename)
{
    g_object_name += "${filename}";
    return '';
}
function set_upload_param(up, filename, ret)
{
    if (ret == false)
    {
        ret = get_signature();
    }
    g_object_name = key;
    if (filename != '') {
        suffix = get_suffix(filename);
        calculate_object_name(filename);
    }
    new_multipart_params = {
        'key' : g_object_name,
        'policy': policyBase64,
        'OSSAccessKeyId': accessid,
        'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
        'callback' : callbackbody,
        'signature': signature
    };
    up.setOption({
        'url': host,
        'multipart_params': new_multipart_params
    });
    up.start();
}
$(function() {
    $("#uploader").plupload({
        // General settings
        runtimes : 'html5,flash,silverlight,html4',
        url : 'http://oss.aliyuncs.com',
        //max_file_count: 20,
        //chunk_size: '20mb',
        filters : {
            max_file_size : '2000mb',
            prevent_duplicates : true //不允许选取重复文件
        },
        rename: false,
        sortable: true,
        dragdrop: true,
        views: {
            list: true,
            thumbs: true, // Show thumbs
            active: 'thumbs'
        },
        flash_swf_url : '../extend/upload-js/js/Moxie.swf',
        silverlight_xap_url : '../extend/upload-js/js/Moxie.xap',

        init: {
            BeforeUpload: function(up, file) {
                //上传前获取签名认证
                set_upload_param(up, file.name, false);
            },

            UploadProgress: function(up, file) {
                var d = document.getElementById(file.id);
                var prog = d.getElementsByTagName('div')[0];
                var progBar = prog.getElementsByTagName('div')[0];
                progBar.style.width= 2*file.percent+'px';
                progBar.setAttribute('aria-valuenow', file.percent);
            },

            FileUploaded: function(up, file, info) {
                //返回值处理
                if (info.status == 200)
                {

                }
                else
                {

                }
            },

            Error: function(up, err) {
                //error处理
                if (err.code == -600) {
                    
                }
                else if (err.code == -601) {

                }
                else if (err.code == -602) {

                }
                else
                {

                }
            }
        }
    });
});