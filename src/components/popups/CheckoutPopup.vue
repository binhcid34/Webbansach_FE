<template>
    <div class="checkout-wrapper">
    
        <div class="checkout-form">
    
            <div class="checkout-title">
    
                <p>Thanh toán</p>
    
                <i @click="closeCheckoutForm" class="fas fa-times"></i>
    
            </div>
    
            <div class="main-content">
    
                <div class="info-customer">
    
                    <p class="info-contact">Thông tin liên hệ</p>
    
                    <div class="row-info">
    
                        <label for="fname"><i class="far fa-user"></i> Họ tên:</label>
    
                        <input type="text" id="fname" v-model="sessionOrder.fullName">
    
                    </div>
    
                    <div class="row-info">
    
                        <label for="phone"><i class="fas fa-mobile-alt"></i> Số điện thoại:</label>
    
                        <input type="text" id="phone" v-model="sessionOrder.phoneNumber">
    
                    </div>
    
                    <div class="row-info">
    
                        <label for="email"><i class="far fa-envelope"></i> Địa chỉ email:</label>
    
                        <input type="text" id="email" v-model="sessionOrder.email">
    
                    </div>
    
                    <div class="row-info">
    
                        <label for="address"><i class="far fa-address-card"></i> Địa chỉ nhận hàng:</label>
    
                        <input type="text" id="address" v-model="sessionOrder.address">
    
                    </div>
    
                </div>
    
                <div class="payment-way">
    
                    <p class="payment-way-title">Hình thức thanh toán</p>
    
                    <div class="row-way">
    
                        <input type="radio" id="transfer" value="2" v-model="sessionOrder.paymentType" />
    
                        <label for="transfer">Chuyển khoản</label>
    
                    </div>
    
                    <div class="row-way">
    
                        <input type="radio" id="cod" value="1" v-model="sessionOrder.paymentType" />
    
                        <label for="cod">Thanh toán khi nhận hàng (Ship COD)</label>
    
                    </div>
    
                    <div v-if="showQrCode" class="transfer-way">
    
                        <div class="info-transfer">
    
                            <p>Quý khách vui lòng chuyển khoản theo đúng các thông tin dưới đây:</p>
    
                            <div class="row-right">
    
                                <p>Tên chủ tài khoản:</p>
    
                                <p>Số tài khoản:</p>
    
                                <p>Ngân hàng:</p>
    
                                <p>Số tiền:</p>
    
                            </div>
    
                            <div class="bold-text">
    
                                <p>Nguyễn Trọng Nghĩa</p>
    
                                <p>109869890676</p>
    
                                <p>Ngân hàng VietinBank</p>
    
                                <p>{{ formatCurrencyVi(totalAmountAfterDiscount) }}</p>
    
                            </div>
    
                        </div>
    
                        <img src="../../assets/qr-code.png" alt="">
    
                    </div>
    
                </div>
    
            </div>
    
            <div class="confirm">
    
                <button @click="checkout">Hoàn tất</button>
    
            </div>
    
        </div>
    
    </div>
</template>

<script>
import { getItems, checkoutApi } from '../../apis/cartApi';
import formatCurrencyVi from '../../utils/formatCurrencyVi';
import { mapState } from 'vuex';
import { useToast } from "vue-toastification";

export default {
    components: {},
    props: {
        totalAmount: {
            type: String,
            default: 0,
        }
    },
    data() {
        return {
            sessionOrder: {

            }
        }
    },
    async created() {
        if (localStorage.getItem('token')) {
            await getItems()
                .then(res => {
                    if (res.data) {
                        this.sessionOrder = res.data;
                        // gán thông tin người nhận cho đơn hàng
                        this.sessionOrder.fullName = this.logInfo.fullname;
                        this.sessionOrder.email = this.logInfo.email;
                        this.sessionOrder.phoneNumber = this.logInfo.phome;
                    }
                });
        }
    },
    methods: {
        formatCurrencyVi,
        closeCheckoutForm() {
            this.$emit('closeCheckoutForm', 0);
        },
        async checkout() {
            const toast = useToast();
            // valid 
            let errorMsg = this.checkError(this.sessionOrder);
            if (errorMsg != "") {
                toast.error(errorMsg, {
                    position: "top-center",
                    showCloseButtonOnHover: true,
                    hideProgressBar: true,
                    closeButton: "button",
                    icon: true,
                    rtl: false,
                });
                return;
            }
            await checkoutApi(this.sessionOrder)
                .then(res => {
                    if (res.success === true) {
                        this.$emit('closeCheckoutForm');
                    } else {
                        toast.error("Sản phẩm trong đơn hàng không đủ hoặc đã hết vui lòng đặt lại hàng")
                        this.$emit('closeCheckoutForm', 0);
                    }
                })
        },

        checkError(sessionOrder) {
            var errorMsg = "";
            if (!sessionOrder.fullName || sessionOrder.fullName == "") {
                return errorMsg = "Không được để trống họ và tên người nhận";
            }
            if (sessionOrder.fullName.length > 50) {
                return errorMsg = "Tên người nhận quá dài"
            }
            if (!sessionOrder.phoneNumber || sessionOrder.phoneNumber == "") {
                return errorMsg = "Không được để trống số điện thoại";
            }
            if (sessionOrder.phoneNumber.length > 25) {
                return errorMsg = "Số điện thoại quá dài";
            }
            if (!sessionOrder.email || sessionOrder.email == "") {
                return errorMsg = "Không được để trống Email";
            }
            if (sessionOrder.email.length > 36) {
                return errorMsg = "Email quá dài";
            }
            if (!sessionOrder.address || sessionOrder.address == "") {
                return errorMsg = "Không được để trống địa chỉ";
            }
            if (sessionOrder.address.length > 255) {
                return errorMsg = "Địa chỉ quá dài";
            }
            return errorMsg;
        }
    },
    computed: {
        ...mapState({ totalAmountAfterDiscount: state => state.cart.totalAmount }),
        showQrCode() {
            return this.sessionOrder.paymentType == 2;
        },
        ...mapState({ logInfo: state => state.user.userInfo })
    }
}
</script>

<style scoped>
@import url(../../css/popup/checkout-popup.css);
</style>