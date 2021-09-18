import { createRouter, createWebHashHistory } from 'vue-router'

const Alice = () => import("./Alice.vue")
const Bob = () => import("./Bob.vue")
const Contract = () => import("./ContractInit.vue")
const Transfer = () => import("./TransferToken.vue")

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            name: "Contract",
            path: "/contract",
            component: Contract
        },
        {
            name: "Transfer Token",
            path: "/",
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
