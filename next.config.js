module.exports = {
    rewrites: () => {
        return [
            {
                source: "/api/predict",
                destination: "http://127.0.0.1:8080/predict",
            }
        ]
    },
    webpack: (config) => {
        // this will override the experiments
        config.experiments = { ...config.experiments, topLevelAwait: true };
        // this will just update topLevelAwait property of config.experiments
        // config.experiments.topLevelAwait = true
        return config;
    },
};
