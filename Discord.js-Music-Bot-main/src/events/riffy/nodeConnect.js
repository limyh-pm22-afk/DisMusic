module.exports = {
    name: "nodeConnect",
    execute(client, node) {
        console.log(`Node "${node.name}" connected.`);
    },
};
