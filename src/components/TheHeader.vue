<template>
    <div class="header">
        <div class="navbar-wrapper">
            <div class="left-header"></div>
            <div class="right-header">
                <ul>
                    <li v-if="isAdmin" @click="redirectAdmin()"><i class="fa-sharp fa-solid fa-toolbox"></i>Quản lý</li>
                    <li @click="redirectHistory" v-if="logged"><i class="fas fa-history"></i>Lịch sử mua hàng</li>
                    <li @click="redirectChangeInfo" v-if="logged" title="Cập nhật thông tin"><i class="fas fa-user"></i>{{ logInfo.fullname }}</li>
                    <li @click="redirectLogin" v-if="!logged"><i class="fas fa-sign-in-alt"></i>Đăng nhập</li>
                    <li  @click="redirectRegister" v-if="!logged"><i class="fas fa-user-plus"></i>Đăng ký</li>
                    <li v-if="logged" @click="logOut"><i class="fa-solid fa-arrow-right-from-bracket"></i>Đăng xuất</li>
                </ul>
            </div>
        </div>
        <div class="search-box-field">
            <img src="../assets/logo-new.png" alt="" @click="redirectHomePage">
            <div class="search-box-wrapper">
                <div class="option-search">Tất cả</div>
                <div class="search-box"><input v-on:keyup.enter="searchProduct" type="text" placeholder="Bạn cần tìm gì?" v-model="searchKey">
                    <i class="fas fa-search"></i></div>
            </div>
            <div class="hotline-wrapper">
                <i class="fas fa-headphones-alt"></i>
                <div class="hotline-info">
                    <p>0933 109 009</p>
                    <p>Hotline</p>
                </div>
            </div>
            <div class="cart-wrapper" @click="redirectCart">
                <i class="fas fa-shopping-cart"></i>
                <p>Giỏ hàng ({{ quantity }})</p>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapActions } from 'vuex';
import cart from '../stores/modules/cart';
import { getItems } from '../apis/cartApi';
import {checkPermission} from '../apis/accountApi'


export default {
    name: 'TheHeader',
    components: {

    },
    data() {
        return {
            searchKey: '',
            logged: false,
            isAdmin: false,
        }
    },
    async created() {
        if(localStorage.getItem('token')) {
            this.logged = true;
        }
        if(this.logged) {
            await getItems()
            .then(res => {
                if(res.data) {
                    res.data.orderDetail.map((element, index) => {
                        element.imageProduct = res.data.listImage[index];
                    });
                    this.updateQuantityCart(res.data.orderDetail.length);
                    this.updateCartItems(res.data.orderDetail);
                    this.updateTotalAmount(res.data.totalPayment);
                    if(res.data.promotionPercent) {
                        this.updatePromotionPercent(res.data.promotionPercent);
                    }
                }
            });
        }
        this.checkPermission();
    },
    methods: {
        ...mapActions({
            updateQuantityCart: 'cart/updateQuantityCart',
            updateCartItems: 'cart/updateCartItems',
            updateTotalAmount: 'cart/updateTotalAmount',
            updatePromotionPercent: 'cart/updatePromotionPercent',
            updateUserInfo: 'user/updateUserInfo',
            setSearchKeyWord: 'product/SET_SEARCH_KEYWORD',
        }),
        redirectHomePage() {
            this.$router.push("/");
        },
        redirectLogin() {
            this.$router.push("/login");
        },
        redirectCart() {
            this.$router.push("/cart");
        },
        redirectHistory() {
            this.$router.push("/history");
        },
        redirectChangeInfo() {
            this.$router.push("/info");
        },
        searchProduct() {
            this.$router.push("/");
            this.setSearchKeyWord(this.searchKey.toString());
        },
        logOut() {
            localStorage.removeItem('token');
            this.logged = false;
            const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
            this.updateCartItems(cartItems);
            this.updateQuantityCart(cartItems.length);
            this.$forceUpdate();
        },
        checkPermission() {
            const me = this;
            checkPermission().then(res => {
                if(res.data) {
                    this.updateUserInfo(res.data);
                }
                if (res && res.success) {
                    me.isAdmin = true;
                }
            })
        },
        redirectAdmin() {
            this.$router.push('/dashboard');
        },
        redirectRegister() {
            this.$router.push('/register');
        }

    },
    computed: {
        ...mapState({ quantity: state => state.cart.quantity }),
        ...mapState({ logInfo: state => state.user.userInfo })
    }
}
</script>

<style scoped>
@import url(../css/components/header.css);
</style>