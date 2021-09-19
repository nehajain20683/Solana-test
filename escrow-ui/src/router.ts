import { createRouter, createWebHashHistory } from 'vue-router'

const Alice = () => import("./Alice.vue")
const Bob = () => import("./Bob.vue")
const Contract = () => import("./InitSwapContract.vue")
// const Transfer = () => import("./TransferToken.vue")
const Swap = () => import("./ContractSwap.vue")
const AddToken = () => import("./AddTokenToContract.vue")

export default createRouter({
    history: createWebHashHistory('/'),
    routes: [
        {
            name: "Swap",
            path: "/swap",
            component: Swap
        },
        {
            name: "Contract",
            path: "/contract",
            component: Contract
        },
        {
            name: "Add token to contract",
            path: '/add-token',
            component: AddToken
        }
    ]
})