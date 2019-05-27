<template>
    <div class="DialogAddress">
        <el-dialog v-dialogDrag title="选择地址簿" custom-class="width620" :visible.sync="dialogVisible" :close-on-click-modal="false" size="tiny">
            <address-list class="list MXscroll" ref="addressList"></address-list>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" :loading="isLoading" @click="submit()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import AddressList from '@/components/AddressList/index'
export default {
    name: 'DialogAddress',
    data() {
        return {
            isLoading: false,
            dialogVisible: false,
            addressList: []
        }
    },
    methods: {
        open(addressList = []) {
            this.addressList = addressList

            this.dialogVisible = true
        },
        submit() {
            this.isLoading = true
            let address = this.addressList.map(item => ({
                address: item.address,
                vars: {
                    phone: '',
                    recipientName: item.name || ''
                }
            }))
            this.$refs.addressList.submit(address)
                .then(() => {
                    this.isLoading = false
                    this.dialogVisible = false
                })
                .catch(() => {
                    this.isLoading = false
                })
        }
    },
    components: {
        'address-list': AddressList
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
