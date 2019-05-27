<template>
  <div class="Payment" style="height:100%"   v-if="isShowPage">
    <!-- <div class="title">
      <span class="Fuma">Fuma</span>
      <span class="MX">MX</span>
    </div> -->
    <!-- <div class="logo">
      <i class="iconfont icon-logo"></i>
    </div> -->
     <a href="/" class="reg_logo" title="孚盟MX"><i class="iconfont icon-logo"></i></a>
      <div class="reg_img">
        <img src="https://sf.fumamx.com/img/orig/3,05afe7c8a595">
      </div>
    <!-- 底部版权 -->
    <!-- <div class="copyright">
      <div>
        Copyright © 2018 Shanghai Fumasoft co.,Ltd.
        <a href="http://www.miitbeian.gov.cn" target="_blank" style="margin-left:5px;">沪ICP备12009685号-4</a>
      </div>
    </div> -->
    <div class="reg_box">
        <div class="reg_body">
          <div class="payBox" v-if="showSelectProduct" v-loading="pageLoading">
              <div style="padding-left:30px;padding-top:30px;">
                <span style="font-size:32px;color:#d0021b">填写许可号</span>
              </div>
              <!-- <div style="border-top:1px solid #eee;margin:10px 0 6px;"></div> -->
              <!-- <div style="padding-top:20px;padding-left:200px;">
                <span style="font-size:14pt;">{{this.currentCompany.corpName}}</span>
              </div> -->
              <div style="padding-left:30px;">
                <table style="margin-top:20px;">
                    <tr>
                      <td>
                         <span style="font-size:14px;color:#606266;">{{currentCompany.corpName}}</span>
                      </td>
                    </tr>
                    <tr>
                      <td  style="padding-top:20px;">
                        <el-input style="width:300px; border-radius:100px; "    size="large" v-model.trim="offlineAuthNo" :placeholder="$t('mxpcweb.companyregister.1528878629850')"></el-input>
                      </td>
                    </tr>
                    <tr >
                      <td  style="padding-top:20px;">
                        <span @click="showHelpPage" style="color:#2AC3F1;cursor:pointer">如何获得序列号？</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-top:20px" >
                        <el-button style="width:300px;margin-top:10px;" size="large" @click="offlineCreateAuth" type="primary">{{ $t('mxpcweb.companyregister.1528878688055') }}</el-button>
                      </td>
                    </tr>
                  </table>
              </div>
          </div>

    <!-- 如何获得序列号？ -->
          <el-dialog  title="" :visible.sync="showHelp" custom-class="width620" :close-on-click-modal="false" >
            <div>
              <span style="font-size:18px;color:#000;font-weight:bold;">如何获得序列号？</span><br /><br />
              <span>序列号是由上海孚盟软件有限公司生成，颁发给需要开通孚盟MX的客户，以证明客户具备正版权益。
                <br>如你还未获取序列号，请联系与你对接的客服。 如需帮助，欢迎随时联系我们400-881-1518</span>
            </div>
            <div class="offline-bank-title" style="font-size:18px;color:#000">{{ $t('mxpcweb.companyregister.1528878819676') }}</div>
                  <div class="offline-table">
                    <div class="offline-table-title" style="width:140px;margin-right:60px;">{{ $t('mxpcweb.companyregister.1528879004705') }}</div>
                    <div class="offline-table-title" style="width:140px;margin-right:60px;">{{ $t('mxpcweb.companyregister.1528879008733') }}</div>
                    <div class="offline-table-title" style="width:110px;" >{{ $t('mxpcweb.companyregister.1528879018978') }}</div>
                  </div>
                  <div style="border-top:1px solid #eee;margin:10px 0 6px;"></div>
                  <div class="offline-table">
                    <div class="offline-table-title" style="width:140px;margin-right:60px;">{{ $t('mxpcweb.companyregister.1528879019618') }}</div>
                    <div class="offline-table-title" style="width:140px;margin-right:60px;">{{ $t('mxpcweb.companyregister.1528879035597') }}</div>
                    <div class="offline-table-title"  style="width:110px;" >11006935635401</div>
                  </div>

                  <div class="offline-remark-title" style="font-size:18px;color:#000">{{ $t('mxpcweb.companyregister.1528879042759') }}<br /></div>
                  <div class="offline-remark">
                    <div  style="height:20px;">1.{{ $t('mxpcweb.companyregister.1528879229313') }}  </div>
                    <div  style="height:20px;">2.{{ $t('mxpcweb.companyregister.1528879247650') }}  </div>
                    <div   style="height:20px;" >3.{{ $t('mxpcweb.companyregister.1528879263510') }} 021-60904622 </div>
                  </div>
            <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="showHelp = false">确 定</el-button>
            </span> -->
          </el-dialog>

        </div>
    </div>
   <!-- 暂时不用 -->
    <div class="payBox" v-if="showSelectProduct_old" v-loading="pageLoading">
      <div v-if="showSelectProduct" style="margin-left:39px;margin-top:19px;">
        <el-tabs v-model="activeName">
          <el-tab-pane :label="$t('mxpcweb.companyregister.1528876314559')" style="color:#333333" name="online" v-if="false">
            <table style="width:590px;margin-top:15px;">
              <tr v-if="false">
                <td colspan="12"><span class="product-title">产品名称</span></td>
              </tr>
              <tr v-if="false">
                <td colspan="12" style="padding-top:10px;">
                  <div :class="productForm.productCode=='PK0001'?'product':'product'" @click="productForm.productCode='PK0001'">
                     <span class="product-word">孚盟MX</span>
                     <span class="hook"><i class="iconfont icon-hook"></i></span>
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="12"  style="padding-top:20px;padding-bottom:10px;">
                  <span class="product-title">套餐年限</span><span class="endtime-word">购买后到期时间：{{productForm.endDate}}</span>
                </td>
              </tr>
              <tr>
                <!-- <td colspan="2">
                   <div :class="productForm.productCode=='PK0001'?'year':'year'" @click="productForm.productCode='PK0001'">
                     <span  >1年</span>
                   </div>
                </td>
                <td   colspan="2">
                   <div :class="productForm.productCode=='PK0001'?'year':'year'" @click="productForm.productCode='PK0001'"
                           style="line-height:10px;padding-top:25px;">
                     <span  >2年</span><br /> <span class="year-song">送6个月</span>
                   </div>
                </td>
                <td  colspan="2">
                   <div :class="productForm.productCode=='PK0001'?'year':'year'" @click="productForm.productCode='PK0001'"
                         style="line-height:10px;padding-top:25px;" >
                     <span>3年</span><br /><span class="year-song">送12个月</span>
                   </div>
                </td> -->
                <td colspan="12">
                    <div :class="productForm.yearNum==1?'year-selected':'year'" @click="productForm.yearNum=1">
                     <span  >1年</span>
                     <span class="hook"  v-if="productForm.yearNum== 1"><i class="iconfont icon-hook"></i></span>
                   </div>
                   <div :class="productForm.yearNum== 2?'year-selected':'year'" @click="productForm.yearNum=2"
                           style="line-height:10px;padding-top:25px;margin-left:30px;">
                     <span  >2年</span><br /> <span class="year-song">送6个月</span>
                     <span class="hook"  v-if="productForm.yearNum== 2"><i class="iconfont icon-hook"></i></span>
                   </div>
                    <div :class="productForm.yearNum== 3?'year-selected':'year'" @click="productForm.yearNum=3"
                         style="line-height:10px;padding-top:25px;margin-left:30px;position: relative;" >
                     <span>3年</span><br /><span class="year-song">送12个月</span>
                     <span class="hook" v-if="productForm.yearNum== 3"><i class="iconfont icon-hook"></i></span>
                     <span class="year-recommend"><span style="font-size:10px;color:rgba(255,255,255,1);">推荐</span></span>
                   </div>
                </td>
              </tr>
              <tr>
               <td colspan="12"  style="padding-top:20px;padding-bottom:10px;">
                  <span class="auth-title">许可人数</span>
                </td>
              </tr>
              <tr >
                <td colspan="12" style="">
                  <div :class="productForm.authNum== 5?'authcount-select':'auth-count'" @click="productForm.authNum=5">5{{ $t('mxpcweb.companyregister.1528877084862') }}
                    <span class="hook" v-if="productForm.authNum== 5"><i class="iconfont icon-hook"></i></span>
                    </div>
                <div :class="productForm.authNum== 10?'authcount-select':'auth-count'" @click="productForm.authNum=10">10{{ $t('mxpcweb.companyregister.1528877084862') }}
                   <span class="hook" v-if="productForm.authNum== 10"><i class="iconfont icon-hook"></i></span></div>
                 <div :class="productForm.authNum== 20?'authcount-select':'auth-count'" @click="productForm.authNum=20">20{{ $t('mxpcweb.companyregister.1528877084862') }}
                    <span class="hook" v-if="productForm.authNum== 20"><i class="iconfont icon-hook"></i></span></div>
                 <div :class="productForm.authNum== 30?'authcount-select':'auth-count'" @click="productForm.authNum=30">30{{ $t('mxpcweb.companyregister.1528877084862') }}
                    <span class="hook" v-if="productForm.authNum== 30"><i class="iconfont icon-hook"></i></span></div>
                <div :class="productForm.authNum== 50?'authcount-select':'auth-count'" @click="productForm.authNum=50">50{{ $t('mxpcweb.companyregister.1528877084862') }}
                   <span class="hook" v-if="productForm.authNum== 50"><i class="iconfont icon-hook"></i></span></div>
                <div>
                   <!-- <div style="height:40px;text-align:center;line-height: 40px;"
                       :class="productForm.authNum== 6?'authcount-select':'auth-count'"      > -->
                       <el-input-number size="large" v-model="productForm.authNum"
                         @change="authHandleChange" :min="5" :max="300" style="width:140px;"></el-input-number>
                         <!-- </div>  <span class="hook" v-if="productForm.authNum== 6"><i class="iconfont icon-hook"></i></span> -->
                </div>
                </td>
              </tr>
            </table>
          <!-- <el-form ref="productForm" :model="productForm" label-position="top" label-width="80px">
              <el-form-item :label="$t('mxpcweb.companyregister.1528876368943')">
               <el-radio-group size="small" v-model="productForm.productCode">
                  <el-radio-button label="PK0001">
                    <div :class="productForm.productCode=='PK0001'?'product':'product'" @click="productForm.productCode='PK0001'"
                    >
                     <span class="product-word">FumaMX{{ $t('mxpcweb.companyregister.1528876400844') }}</span></div>
                      </el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('mxpcweb.companyregister.1528876863722')">
                <el-radio-group size="small" v-model="productForm.yearNum">
                  <el-radio-button label="1">1{{ $t('mxpcweb.companyregister.1528876901342') }}</el-radio-button>
                  <el-radio-button label="2">2{{ $t('mxpcweb.companyregister.1528876901342') }}<span style="font-size:12px;">({{ $t('mxpcweb.companyregister.1528876947415',{a:6}) }})</span></el-radio-button>
                  <el-radio-button label="3">3{{ $t('mxpcweb.companyregister.1528876901342') }}<span style="font-size:12px;">({{ $t('mxpcweb.companyregister.1528876947415',{a:12}) }})</span></el-radio-button>
                </el-radio-group>
                <div style="margin-top:5px;line-height:16px;">
                  {{ $t('mxpcweb.companyregister.1528877018747') }} ：
                  <span style="color:#008cee">{{productForm.endDate}}</span>
                </div>
              </el-form-item>
              <el-form-item :label="$t('mxpcweb.companyregister.1528877045038')">
                <el-radio-group size="small" v-model="productForm.authNum">
                  <el-radio-button label="5">5{{ $t('mxpcweb.companyregister.1528877084862') }}</el-radio-button>
                  <el-radio-button label="10">10{{ $t('mxpcweb.companyregister.1528877084862') }}</el-radio-button>
                  <el-radio-button label="20">20{{ $t('mxpcweb.companyregister.1528877084862') }}</el-radio-button>
                  <el-radio-button label="30">30{{ $t('mxpcweb.companyregister.1528877084862') }}</el-radio-button>
                  <el-radio-button label="50">50{{ $t('mxpcweb.companyregister.1528877084862') }}</el-radio-button>
                </el-radio-group>
                <el-input-number size="small" v-model="productForm.authNum" @change="authHandleChange" :min="5" :max="300" style="width:110px;margin-left:10px;"></el-input-number>
              </el-form-item>
            </el-form>  -->

            <!-- <div style="border-top:1px solid #eee;margin-bottom:6px;"></div> -->
            <div style="margin-top: 30px;height:40px;line-height:20px;">
              <span class="config-title">{{ $t('mxpcweb.companyregister.1528877521503') }}</span>
            </div>
            <!-- 当前配置 -->
            <div style="margin-right:43px;">
              <table class="currentConfig">
                <!-- <tr>
                  <td><span class="config-title">{{ $t('mxpcweb.companyregister.1528877521503') }}</span></td>
                  <td colspan="3"></td>
                </tr> -->
                <tr>
                  <td style="width:120px;padding-top:18px;"><span class="config-word">{{ $t('mxpcweb.companyregister.1528876368943') }}：</span></td>
                  <!-- 产品名称 -->
                  <td style="padding-right:130px;width:100px;padding-top:18px;"><span class="config-word" style="color:#303133">{{productForm.productName}}</span></td>
                  <td style="width:90px;padding-top:18px;"><span class="config-word">{{ $t('mxpcweb.companyregister.1528877612109') }}：</span></td>
                  <!-- 到期时间 -->
                  <td style="padding-top:18px;"><span class="config-word" style="color:#303133">{{productForm.endDate}}</span></td>
                </tr>
                <tr>
                  <td ><span class="config-word">{{ $t('mxpcweb.companyregister.1528879942148') }}：</span></td>
                  <td>
                    <span style="color:#D0021B">{{productForm.authNum}}{{ $t('mxpcweb.companyregister.1528877084862') }}</span></td>
                  <td  ><span class="config-word">{{ $t('mxpcweb.companyregister.1528877732941') }}：</span></td>
                  <td>
                    <span style="color:#D0021B">{{productForm.authNum * baseSpaceNum}}G</span></td>
                </tr>
                <tr>
                  <td  style="padding-bottom:13px;"><span class="config-word">{{ $t('mxpcweb.companyregister.1528877816694') }}：</span></td>
                  <td colspan="3"  style="padding-bottom:13px;">
                    <span class="config-word" style="color:#FF7F2C">{{giveAmount}}</span>
                    <span class="config-word">{{ $t('mxpcweb.companyregister.1528877871077') }}</span></td>
                </tr>
              </table>
            </div>
            <!-- <div style="border-top:1px solid #eee;margin:10px 0 6px;"></div> -->

            <!-- <table class="currentConfig widthFull">
              <tr>
                <td align="right" style="width:119px;">{{ $t('mxpcweb.companyregister.1528878000304') }}：</td>
                <td style="color:orange">{{perYearPrice}}{{ $t('mxpcweb.companyregister.1528878245987') }}*{{productForm.yearNum}}{{ $t('mxpcweb.companyregister.1528876901342') }}={{totalPrice}}{{ $t('mxpcweb.companyregister.1528878245987') }}</td>
                <td align="right" rowspan="2">
                  <el-button type="primary" style="margin-top:12px; width:130px;" @click="showSelectPaymentPage">{{ $t('mxpcweb.companyregister.1528878299485') }}</el-button>
                </td>
              </tr>
              <tr>
                <td align="right">{{ $t('mxpcweb.companyregister.1528878346132') }}：</td>
                <td style="color:orange">¥ {{totalPrice}}</td>
              </tr>
            </table> -->
            <div style="margin-top: 30px;margin-right:43px;">
              <div class="total-btn">
                   <span @click="showSelectPaymentPage" class="total-btn-word">
                      {{$t('mxpcweb.companyregister.1528878299485')}}
                   </span>
              </div>
              <div class="total-price" style="width:170px;margin-right:50px">
                {{ $t('mxpcweb.companyregister.1528878346132') }}：¥ <span style=" font-size:22px;color:#D0021B;font-weight:bold">{{totalPrice}}</span>
              </div>
              <div class="total-detail">{{ $t('mxpcweb.companyregister.1528878000304') }}：
                ¥{{perYearPrice}}
                <!-- {{ $t('mxpcweb.companyregister.1528878245987') }} -->
                ×{{productForm.yearNum}}{{ $t('mxpcweb.companyregister.1528876901342') }}
                = ¥{{totalPrice}}
                <!-- {{ $t('mxpcweb.companyregister.1528878245987') }} -->
              </div>

            </div>
          </el-tab-pane>
          <!-- 线下支付 -->
           <el-tab-pane :label="$t('mxpcweb.companyregister.1528882498798')" name="offline" class="offlineTab" v-if="false">
            <div class="offline-word">
              <div  style="height:20px;margin-bottom:10px;">1.{{ $t('mxpcweb.companyregister.1528878575393') }}</div>
              <div  style="height:20px;">2.{{ $t('mxpcweb.companyregister.1528878604840') }}</div>
            </div>
            <table style="margin-top:20px;">
              <tr>
                <td>
                  <el-input style="width:300px;" size="large" v-model.trim="offlineAuthNo" :placeholder="$t('mxpcweb.companyregister.1528878629850')"></el-input>
                </td>
              </tr>
              <tr>
                <td>
                  <el-button style="width:300px;margin-top:10px;" size="large" @click="offlineCreateAuth" type="primary">{{ $t('mxpcweb.companyregister.1528878688055') }}</el-button>
                </td>
              </tr>
            </table>

            <!-- <div style="border-top:1px solid #eee;margin:15px 0 6px;"></div> -->

            <div class="offline-bank-title">{{ $t('mxpcweb.companyregister.1528878819676') }}</div>
            <!-- <table class="accountMsg">
              <tr style="background-color:ghostwhite">
                <th>{{ $t('mxpcweb.companyregister.1528879004705') }}</th>
                <th>{{ $t('mxpcweb.companyregister.1528879008733') }}</th>
                <th>{{ $t('mxpcweb.companyregister.1528879018978') }}</th>
              </tr>
              <tr>
                <td>{{ $t('mxpcweb.companyregister.1528879019618') }}</td>
                <td>{{ $t('mxpcweb.companyregister.1528879035597') }}</td>
                <td>11006935635401</td>
              </tr>
            </table> -->
            <div class="offline-table">
               <div class="offline-table-title" style="width:140px;margin-right:60px;">{{ $t('mxpcweb.companyregister.1528879004705') }}</div>
               <div class="offline-table-title" style="width:140px;margin-right:60px;">{{ $t('mxpcweb.companyregister.1528879008733') }}</div>
               <div class="offline-table-title" style="width:110px;" >{{ $t('mxpcweb.companyregister.1528879018978') }}</div>
            </div>
            <div style="border-top:1px solid #eee;margin:10px 0 6px;"></div>
            <div class="offline-table">
               <div class="offline-table-title" style="width:140px;margin-right:60px;">{{ $t('mxpcweb.companyregister.1528879019618') }}</div>
               <div class="offline-table-title" style="width:140px;margin-right:60px;">{{ $t('mxpcweb.companyregister.1528879035597') }}</div>
               <div class="offline-table-title"  style="width:110px;" >11006935635401</div>
            </div>

            <div class="offline-remark-title">{{ $t('mxpcweb.companyregister.1528879042759') }}<br /></div>
            <div class="offline-remark">
              <div  style="height:20px;margin-bottom:10px;">1.{{ $t('mxpcweb.companyregister.1528879229313') }}  </div>
              <div  style="height:20px;margin-bottom:10px;">2.{{ $t('mxpcweb.companyregister.1528879247650') }}  </div>
              <div   style="height:20px;" >3.{{ $t('mxpcweb.companyregister.1528879263510') }} 021-60904622 </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 支付页面 -->

      <div v-if="showSelectPayment" class="onlinePay" style="onlinePay">
        <el-tabs v-model="payActiveName" style="padding-top:19px;margin-left:40px">
          <!-- 线上支付 -->
          <el-tab-pane :label="$t('mxpcweb.companyregister.1528879492158')" name="onlinepay" >
            <el-row>
              <el-col :span="24">
                    <!-- 当前配置 -->
            <!-- <div style="margin-right:43px;">
              <table class="currentConfig">
                <tr>
                  <td><span class="config-word">{{ $t('mxpcweb.companyregister.1528876368943') }}：</span></td>
                  <td><span class="config-word">{{productForm.productName}}</span></td>
                  <td style="width:150px;"><span class="config-word">{{ $t('mxpcweb.companyregister.1528877612109') }}：</span></td>
                  <td><span class="config-word">{{productForm.endDate}}</span></td>
                </tr>
                <tr>
                  <td ><span class="config-word">{{ $t('mxpcweb.companyregister.1528877643117') }}：</span></td>
                  <td>
                    <span style="color:#D0021B">{{productForm.authNum}}{{ $t('mxpcweb.companyregister.1528877084862') }}</span></td>
                  <td  ><span class="config-word">{{ $t('mxpcweb.companyregister.1528877732941') }}：</span></td>
                  <td>
                    <span style="color:#D0021B">{{productForm.authNum * baseSpaceNum}}G</span></td>
                </tr>
                <tr>
                  <td  ><span class="config-word">{{ $t('mxpcweb.companyregister.1528877816694') }}：</span></td>
                  <td colspan="3">
                    <span class="config-word" style="color:#FF7F2C">{{giveAmount}}</span>
                    <span class="config-word">{{ $t('mxpcweb.companyregister.1528877871077') }}</span></td>
                </tr>
              </table>
            </div> -->
          <!-- 当前配置 -->
            <div style="margin-top:20px;">
              <table class="currentConfig">
                <!-- <tr>
                  <td><span class="config-title">{{ $t('mxpcweb.companyregister.1528877521503') }}</span></td>
                  <td colspan="3"></td>
                </tr> -->
                <tr>
                  <td style="width:120px;padding-top:18px;"><span class="config-word">{{ $t('mxpcweb.companyregister.1528876368943') }}：</span></td>
                  <!-- 产品名称 -->
                  <td style="padding-right:130px;width:100px;padding-top:18px;"><span class="config-word" style="color:#303133">{{productForm.productName}}</span></td>
                  <td style="width:90px;padding-top:18px;"><span class="config-word">{{ $t('mxpcweb.companyregister.1528877612109') }}：</span></td>
                  <!-- 到期时间 -->
                  <td style="padding-top:18px;"><span class="config-word" style="color:#303133">{{productForm.endDate}}</span></td>
                </tr>
                <tr>
                  <td ><span class="config-word">{{ $t('mxpcweb.companyregister.1528879942148') }}：</span></td>
                  <td>
                    <span style="color:#D0021B">{{productForm.authNum}}{{ $t('mxpcweb.companyregister.1528877084862') }}</span></td>
                  <td  ><span class="config-word">{{ $t('mxpcweb.companyregister.1528877732941') }}：</span></td>
                  <td>
                    <span style="color:#D0021B">{{productForm.authNum * baseSpaceNum}}G</span></td>
                </tr>
                <tr>
                  <td style="padding-bottom:13px;" ><span class="config-word">{{ $t('mxpcweb.companyregister.1528877816694') }}：</span></td>
                  <td colspan="3" style="padding-bottom:13px;">
                    <span class="config-word" style="color:#FF7F2C">{{giveAmount}}</span>
                    <span class="config-word">{{ $t('mxpcweb.companyregister.1528877871077') }}</span></td>
                </tr>
              </table>
            </div>

                <!-- <table class="currentConfig">
                  <tr>
                    <td colspan="4">{{ $t('mxpcweb.companyregister.1528877521503') }}</td>
                  </tr>
                  <tr>
                    <td>{{ $t('mxpcweb.companyregister.1528876368943') }}：</td>
                    <td>{{productForm.productName}}</td>
                    <td>{{ $t('mxpcweb.companyregister.1528877612109') }}：</td>
                    <td>{{productForm.endDate}}</td>
                  </tr>
                  <tr>
                    <td>{{ $t('mxpcweb.companyregister.1528879942148') }}：</td>
                    <td>
                      <span style="color:#008cee">{{productForm.authNum}}</span>{{ $t('mxpcweb.companyregister.1528877084862') }}</td>
                    <td>{{ $t('mxpcweb.companyregister.1528877732941') }}：</td>
                    <td>
                      <span style="color:#008cee">{{productForm.authNum * baseSpaceNum}}</span>G</td>
                  </tr>
                  <tr>
                    <td>{{ $t('mxpcweb.companyregister.1528877816694') }}：</td>
                    <td colspan="3">
                      <span style="color:#008cee">{{giveAmount}}</span>{{ $t('mxpcweb.companyregister.1528877871077') }}</td>
                  </tr>
                </table> -->
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div style="padding-top:30px;">
                    <div style="padding-left:120px;margin-top:10px;margin-right:6px;float:left;height:30px;font-size:12px;color:rgba(102,102,102,1);line-height:30px;">
                      {{ $t('mxpcweb.companyregister.1528880850913') }}：
                      <span style="color: #D0021B;font-weight:bold;font-size:22px;text-align:center; ">¥{{totalPrice}}</span>
                    </div>
                    <div style="float:left">
                      <el-button  type="primary" style="width:145px;margin-right:6px;background:rgba(208,2,27,1);border-radius:4px;" size="large" @click="payNow">
                        <span style="font-size:14px;font-family:PingFangSC-Medium;color:rgba(255,255,255,1);">{{ $t('mxpcweb.companyregister.1528878299485') }}</span></el-button>
                    </div>
                    <div style="float:left">
                      <el-button  type="primary"  style="width:145px;border-radius:4px;background-color:#ffffff;border-color:#DFE2E4" size="large"  @click="reSelectProduct">
                         <span style="font-size:14px;font-family:PingFangSC-Medium;color:#606266;"> {{ $t('mxpcweb.companyregister.1528880905032') }}</span></el-button>
                    </div>
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>

        </el-tabs>
      </div>
  </div>

</template>

<script>
import { isObject } from '@/libs/utils.js'
import { mapGetters } from 'vuex'

export default {
  name: 'Payment',
  props: {},
  data () {
    return {
      showSelectProduct_old: false,
      showHelp: false,
      permissionCb: false, // 注册协议
      needChangeName: false,
      pageLoading: false,
      perYearPrice: 7500,
      payActiveName: 'onlinepay',
      currentCompany: null,
      unitPrice: 1500, // 单价
      totalPrice: 7500, // 总价
      showSelectPayment: false, // 是否要付款页面
      showSelectProduct: false,
      baseSpaceNum: 10, // 基础空间大小
      giveAmount: 1000, // 初始化默认数量
      productForm: {
        productCode: 'PK0001',
        productName: 'FumaMX',
        yearNum: 1,
        // endDate: this.$m_unifiedTime(new Date().setMonth(new Date().getMonth() + 12)),
        endDate: this.$moment(new Date().setMonth(new Date().getMonth() + 12)).format(
          'YYYY-MM-DD'
        ),
        authMonth: 12,
        authNum: 5 // 授权数量
      },
      orderNo: '',
      offlineAuthNo: '', // 现在授权许可号
      activeName: 'offline',
      isShowPage: false,
      payType: 'online'
    }
  },
  created() {

  },
  computed: {
    ...mapGetters(['company'])
  },
  methods: {
    // 显示帮助页面
    showHelpPage() {
      this.showHelp = true
    },
    initOfflineInfo (authNo, companyMsg) {
      this.offlineAuthNo = authNo
      this.currentCompany = companyMsg
    },
    /**
     * 线下开通
     */
    offlineCreateAuth () {
      var _this = this
      if (_this.offlineAuthNo == '') {
        return
      }
      _this.pageLoading = true
      var data = {
        cid: _this.currentCompany.cId,
        ctid: _this.currentCompany.ctId,
        offlineauthno: _this.offlineAuthNo,
        companyName: _this.currentCompany.corpName,
        needChangeName: _this.needChangeName
      }

      this.$http
        .post(this.Global.baseURL + this.Global.api.v2.offlinePay, data)
        .then((res) => {
          _this.pageLoading = false
          if (res.body && res.body.code.toString() == _this.Global.RES_OK) {
            _this.$message.success(_this.$t('mxpcweb.companyregister.1528881398692'))
            setTimeout(function () {
              _this.$router.push('/login')
              location.reload()
              //  _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.navigator_get, { params: {} }).then(function(res) {
              //       setStore("navigator", res.body.data);
              //       _this.$router.push("/");  //跳转进企业
              //     },function(res){
              //       _this.$message.error(_this.msg(res.body));
              //     });
            }
              , 1500)
          } else {
            if (res.body.status != null && res.body.status == 'E') {
              _this.$confirm(_this.$t('mxpcweb.companyregister.1528881462141'), _this.$t('mxpcweb.companyregister.1528881542385'), {
                confirmButtonText: _this.$t('mxpcweb.companyregister.1528881567265'),
                cancelButtonText: _this.$t('mxpcweb.companyregister.1528881591272'),
                type: 'warning'
              }).then(() => {
                _this.needChangeName = true
                _this.offlineCreateAuth()
              }).catch(() => {

              })
            } else {
              _this.$message.error(_this.msg(res.body))
            }
          }
        }, (res) => {
          _this.pageLoading = false
          _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
        }
        )
    },
    /**
     * 重新选择产品
     */
    reSelectProduct () {
      let _this = this
      let data = {
        cid: _this.currentCompany.cId,
        orderno: _this.orderNo
      }
      this.$http
        .delete(this.Global.baseURL + this.Global.api.v2.reSelectProduct, { params: data}).then((res) => {
          if (res.body && res.body.code.toString() == _this.Global.RES_OK) {
            _this.orderNo = ''
            _this.showSelectPayment = false
            _this.showSelectProduct = true
          } else {
            _this.$message.error(_this.msg(res.body))
          }
        }, (res) => {
          _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
        })
    },
    /**
     * 立刻支付
     */
    payNow () {
      let _this = this
      let data = {
        cid: _this.currentCompany.cId,
        ctid: _this.currentCompany.ctId,
        totalAmount: _this.totalPrice,
        giveAmount: _this.giveAmount,
        product: 'ALL',
        orderno: _this.orderNo
      }
      console.log(data)
      this.$http
        .post(this.Global.baseURL + this.Global.api.n1.mxpay, data)
        .then((res) => {
          console.log(res)
          if (res.body && res.body.code.toString() == _this.Global.RES_OK) {
            var obj = res.body.data
            if (
              obj != null &&
              obj.resultString != null &&
              obj.resultString != ''
            ) {
              window.location.href = obj.resultString
            }
          } else {
            _this.$message.error(_this.msg(res.body))
          }
        }, (res) => {
          _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
        })
    },
    /**
     * 展示选择支付页面(在线支付)
     */
    showSelectPaymentPage () {
      let _this = this
      _this.pageLoading = true
      let data = {
        cid: _this.currentCompany.cId,
        pkname: _this.productForm.productName, // 产品名称
        pkcode: _this.productForm.productCode, // 产品code
        expirationtime: _this.productForm.endDate, // 到期时间
        authcount: _this.productForm.authNum, // 授权数量
        spacecount: _this.productForm.authNum * _this.baseSpaceNum, // 空间大小
        monthcount: _this.productForm.authMonth, // 授权月数
        totalamount: _this.totalPrice, // 总价
        unitprice: _this.unitPrice, // 单价
        paytype: _this.payType, // 支付方式
        ctid: _this.currentCompany.ctId,
        companyname: _this.currentCompany.corpName,
        authyear: _this.productForm.yearNum
      }
      this.$http.post(this.Global.baseURL + this.Global.api.v2.authOrder, data).then((res) => {
        _this.pageLoading = false
        if (res.body && res.body.code.toString() == _this.Global.RES_OK) {
          _this.orderNo = res.body.data
          _this.showSelectPayment = true
          _this.showSelectProduct = false
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, (res) => {
        _this.pageLoading = false
        _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
      })
    },
    authHandleChange (val) { },
    /**
     * 展示界面
     */
    showPage (companyInfo) {
      // console.log(companyInfo)
      // console.log(companyInfo)
      // console.log(companyInfo)
      if (!companyInfo.status) { return }
      this.currentCompany = companyInfo
      this.isShowPage = true
      this.showSelectProduct = true
      if (companyInfo.status == -5) {
          // 未开通
        } else if (companyInfo.status == -6) {
          // 开通未付款
          // this.pageLoading = true
          // this.getAuthInfo(companyInfo.cId) // 线下付款 暂时取消
        }
    },
    /**
     * 获取许可信息
     */
    getAuthInfo (cid) {
      let _this = this
      this.$http.get(this.Global.baseURL + this.Global.api.v2.getAuthInfo, {
        params: { cid: cid }
      }).then((res) => {
        if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data)) {
          var authObj = res.body.data
          _this.productForm.productName = authObj.pkname // 产品名称
          _this.productForm.productCode = authObj.pkcode // 产品code
          _this.productForm.endDate = authObj.expirationtime // 到期时间
          _this.productForm.authNum = authObj.authcount// 授权数量
          _this.productForm.yearNum = authObj.authyear// 授权year
          // 空间大小spacecount
          _this.productForm.authMonth = authObj.monthcount// 授权月数
          _this.totalPrice = authObj.totalamount // 总价
          _this.unitPrice = authObj.unitprice // 单价
          _this.payType = authObj.paytype // 支付方式
          _this.orderNo = authObj.orderno// 订单号
          _this.showSelectPayment = true
          _this.showSelectProduct = false
        } else {
          _this.$message.error(_this.msg(res.body))
        }
        _this.pageLoading = false
      }, (res) => {
        _this.pageLoading = false
        _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
      }
      )
    },
    // 显示注册
    showPer () {
      var iHeight = 800
      var iWidth = 980
      // 获得窗口的垂直位置
      var iTop = (window.screen.availHeight - 30 - iHeight) / 2
      // 获得窗口的水平位置
      var iLeft = (window.screen.availWidth - 10 - iWidth) / 2
      window.open(window.location.origin + '/pc/userLicenseAgreement', 'newwindow', 'height=' + iHeight + ',,innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' +
            iWidth + ',top=' + iTop + ',left=' + iLeft + ',status=no,toolbar=no,menubar=no,location=no,resizable=no,scrollbars=0,titlebar=no')
    }
  },
  watch: {
    productForm: {
      handler (newValue, oldValue) {
        /**
         *  监听套餐年限
         */
       if (newValue.yearNum == 1) {
          this.productForm.authMonth = newValue.yearNum * 12
          this.productForm.endDate = this.$moment(
            new Date().setMonth(new Date().getMonth() + 12)
          ).format('YYYY-MM-DD')
        } else if (newValue.yearNum == 2) {
          this.productForm.authMonth = newValue.yearNum * 12 + 6
          this.productForm.endDate = this.$moment(
            new Date().setMonth(new Date().getMonth() + 30)
          ).format('YYYY-MM-DD')
        } else if (newValue.yearNum == 3) {
          this.productForm.authMonth = newValue.yearNum * 12 + 12
          this.productForm.endDate = this.$moment(
            new Date().setMonth(new Date().getMonth() + 48)
          ).format('YYYY-MM-DD')
        }
        /**
         * 监听产品名称
         */
        if (newValue.productCode == 'PK0001') {
          this.productForm.productName = 'FumaMX'
        }
        /**
         * 监听授权数量
         */
        if (newValue.authNum < 10) {
          this.unitPrice = 1500
        } else if (newValue.authNum < 20) {
          this.unitPrice = 1300
        } else if (newValue.authNum < 30) {
          this.unitPrice = 1200
        } else if (newValue.authNum < 50) {
          this.unitPrice = 1100
        } else if (newValue.authNum >= 50) {
          this.unitPrice = 1000
        }
        // 总价
        this.perYearPrice = this.unitPrice * this.productForm.authNum
        if (newValue.authNum >= 10) {
          this.perYearPrice = this.perYearPrice - 200
        }
        this.totalPrice = this.perYearPrice * this.productForm.yearNum
      },
      deep: true
    },
    $route (newValue, oldValue) {
      if (newValue.fullPath == '/companyregister') {
        this.showSelectPayment = false
        this.showSelectProduct = false
      }
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
