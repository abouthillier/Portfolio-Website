import ParticleEffect from './ParticleEffect';

export default {
    mounted() {
        const container = this.$el.querySelector('.particle-container');
        if (container) {
            new ParticleEffect(container, {
                nodeCount: 40,
                lineDistance: 200,
                useLogos: true,
                logoSize: 40
            });
        }
    }
} 