import { createRouter, createWebHashHistory } from 'vue-router'

const Alice = () => import("./Alice.vue")
const Bob = () => import("./Bob.vue")
const Contract = () => import("./ContractInit.vue")
const Transfer = () => import("./TransferToken.vue")
const Swap = () => import("./ContractSwap.vue")

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
            name: "Transfer Token",
            path: "/transfer",
            component: Transfer
        },
        {
            name: "Alice",
            path: "/alice",
            component: Alice
        },
        {
            name: "Bob",
            path: "/bob",
            component: Bob
        }
    ]
})
