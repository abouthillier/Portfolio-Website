export default class Tabs {
    constructor(container) {
        this.container = container;
        this.tabs = container.querySelectorAll('[data-tab]');
        this.panels = container.querySelectorAll('[data-panel]');
        this.activeTab = 0;

        this.init();
    }

    init() {
        this.tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => this.switchTab(index));
        });

        // Initialize first tab
        this.switchTab(0);
    }

    switchTab(index) {
        // Update tabs
        this.tabs.forEach((tab, i) => {
            if (i === index) {
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
            } else {
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
            }
        });

        // Update panels
        this.panels.forEach((panel, i) => {
            if (i === index) {
                panel.classList.remove('hidden');
                panel.classList.add('block');
            } else {
                panel.classList.add('hidden');
                panel.classList.remove('block');
            }
        });

        this.activeTab = index;
    }
} 