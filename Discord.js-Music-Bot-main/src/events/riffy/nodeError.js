module.exports = {
    name: "nodeError",
    execute(client, node, error) {
        console.error(`Node "${node.name}" encountered an error: ${error.message}`);
    },
};
