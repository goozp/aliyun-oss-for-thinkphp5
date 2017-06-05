<?php
namespace app\index\aliyun\oss;
require_once EXTEND_PATH.'aliyun/oss/autoload.php';
use OSS\OssClient;
use OSS\Core\OssException;

/**
 * Class ossBase
 * 阿里云oss的base类，用于获取OssClient实例和其他公用方法
 * @author 郭仲平
 */
class ossBase{
    protected static $endpoint = '';
    protected static $accessKeyId = '';
    protected static $accessKeySecret = '';
    protected static $bucket = '';
    protected static $callBackUrl = '';
    private static $result;

    /**
     * ossBase constructor.获取配置信息
     */
    public function __construct()
    {
        self::$endpoint         = config('aliyun-oss.OSS_ENDPOINT');
        self::$accessKeyId      = config('aliyun-oss.OSS_ACCESS_ID');
        self::$accessKeySecret  = config('aliyun-oss.OSS_ACCESS_KEY');
        self::$bucket           = config('aliyun-oss.OSS_BUCKET');
        self::$callBackUrl      = config('aliyun-oss.OSS_CALLBACKURL');
        self::$result = array();
    }

    /**
     * 获取OssClient实例
     * @return array|string
     */
    public static function getOssClient()
    {
        if (self::$endpoint == '' || self::$accessKeyId == '' || self::$accessKeySecret == '' || self::$bucket == ''){
            new self();
        }
        try {
            $ossClient = new OssClient(self::$accessKeyId, self::$accessKeySecret, self::$endpoint, false);
            $result = self::getResult('success', '', $ossClient);
        } catch (OssException $e) {
            $error_msg  = __FUNCTION__ . "creating OssClient instance: FAILED\n";
            $error_msg .= $e->getMessage() . "\n";
            $result = self::getResult('error', $error_msg, '');
        }
        return $result;
    }

    /**
     * 获取bucket名称
     * @return mixed|string
     */
    public static function getBucketName()
    {
        return self::$bucket;
    }


    public function getOssCon()
    {
        return array(
            'endpoint'          => self::$endpoint,
            'accessKeyId'       => self::$accessKeyId,
            'accessKeySecret'   => self::$accessKeySecret,
            'bucket'            => self::$bucket,
            'callBackUrl'       => self::$callBackUrl,
        );
    }

    /**
     * 写入输出结果
     * @param $status string 状态
     * @param $msg string 信息
     * @param $info array|object|string 结果资源
     * @return array
     */
    public static function getResult($status, $msg, $info)
    {
        return self::$result = array(
            'status' => $status,
            'msg'    => $msg,
            'info'   => $info
        );
    }
}