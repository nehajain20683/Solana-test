import { createRouter, createWebHashHistory } from 'vue-router'

const Alice = () => import("./Alice.vue")
const Bob = () => import("./Bob.vue")
const Contract = () => import("./ContractInit.vue")

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            name: "Contract",
            path: "/",
            component: Contract
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
