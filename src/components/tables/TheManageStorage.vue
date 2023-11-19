<template>
    <div class="manage-product manage-storage">
        <div class="header-manage flex">
            <div class="flex">
                <div class="btn" :class="statusStorage==1?'active':'disabled'" @click="handleChoose(1)"> Danh sách hàng tồn</div>
                <div class="btn" :class="statusStorage==2?'active':'disabled'" @click="handleChoose(2)"> Danh sách hàng cần nhập</div>
            </div>
            <div class="flex">
                <div class="search-table">
                    <input placeholder="Nhập từ bạn muốn tìm kiếm" v-model="filterSearch"/>
                    <i class="fa-solid fa-magnifying-glass"></i>
                </div>
                <div class="btn-insert" @click="add()">
                    <span>Thêm mới</span>
                </div>
            </div>
        </div>
        <TheTable 
            :listColumns="listColumns"
            :listData="listProduct"
            :listDataCategory="listCategory"
        />
        <div class="apui-popup" v-if="isShowPopup">
            <DetailPopup 
                :detailData="newProduct"
                :type=1
                :listDataCategory="listCategory"
                @closePopup="closePopup"
            />
        </div>
    </div>
</template>

<script>
import TheTable from './TheTable.vue';
import {getProductStorage, getAllCategory} from '../../apis/productApi';
import ThePagination from '../ThePagination.vue';
import DetailPopup from '../popups/DetailPopup.vue';
import { mapState, mapActions } from 'vuex';


export default {
    components: { TheTable, ThePagination, DetailPopup },
    created(){
        this.getProduct();
        this.getAllCategory();  
    },
    methods: {
        ...mapActions({
            toggleLoading: 'loading/toggleLoading',
        }),
       async getProduct() {
            this.toggleLoading(true);
            let payload = {
                status : this.statusStorage,
                search: this.filterSearch,
            }
            await getProductStorage(payload).then((res) => {
                this.toggleLoading(false);
                if (res.data && res.data) {
                    this.listProduct = res.data;
                }
            })
        },
        caculationPageCount(total) {
            if (total % this.pageSize == 0) this.pageCount = total / this.pageSize;
            else this.pageCount = parseInt(total/this.pageSize) + 1;
        },
        choosePage(page) {
            this.pageNumber = page;
            this.getProduct();
        },
        add() {
            this.isShowPopup =true;
        },
        closePopup() {
            this.isShowPopup = false;
        },
        getAllCategory() {
            getAllCategory().then((res) => {
                if (res && res.success) {
                    this.listCategory = res.data;
                }
                else {

                }
            })
        },
        // Hàm xử lý khi chọn loại hàng tồn hay hàng cần nhập
        async handleChoose(status){
            this.statusStorage = status;
            this.filterSearch = '';
            await this.getProduct();
        }
    },
    data() {
        return {
            listColumns:[
                "Tên sách",
                "Tên tác giả",
                "Thể loại",
                "Nhà xuất bản",
                "Số lượng còn lại",
            ],
            listProduct:[],
            pageCount: 1,
            pageNumber: 1,
            pageSize: 30,
            filterSearch: '',
            newProduct:{
                nameProduct:'',
                author:'',
                idCategory: 1,
                titleProduct: '',
                imageProduct: null,
                quantitySock : 1,
            },
            isShowPopup: false,
            listCategory: null,
            statusStorage : 1
        }
    },
    watch:{
        filterSearch(newVal) {
            this.getProduct();
        }
    }
  
}
</script>

<style scoped>
@import url(../../css/manage-product.css);
.header-manage{
    display: flex;
    justify-content: space-between;
    margin-top: 64px;
    padding: 16px 48px;
}
.flex {
    display: flex;
}

.header-manage input{
    height: 32px;
    width: 240px;
    border-radius: 4px;
}
.header-manage .search-table{
    position: relative;
    
}
.header-manage .search-table i {
    position: absolute;
    top: 8px;
    right: 8px;
    color: #000;
}
.header-manage .btn-insert{
    height: 32px;
    width: 80px;
    background-color: aquamarine;
    align-items: center;
    display: flex;
    justify-content: center;
    border-radius: 4px;
    color: #f2efef;
}
.header-manage .btn{
    background-color: #fff;
    color: #000;
    padding: 4px 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 8px;
    border-radius: 8px;
    cursor: pointer;
}
.active {
    background-color: #348013 !important;
    border: 1px solid #71dd43;
    color: #fff !important;
}
.manage-product{
    padding-bottom: 24px;
}
.search-table{
    margin-right: 8px;
}
</style>

<style>
.manage-storage .wrap-table100{
    /* max-height: 540px; */
    overflow-x: auto;
    /* min-height: 540px; */
}
</style>
