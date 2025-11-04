class TwoOfThree extends HTMLElement {
  constructor() {
    super();
    this.history = [];
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="switches">
        <switch-item text="Fast" tabindex="0"></switch-item>
        <switch-item text="Good" tabindex="0"></switch-item>
        <switch-item text="Cheap" tabindex="0"></switch-item>
      </div>
    `;

    this.cycling = true;
    this.switches = Array.from(this.querySelectorAll('switch-item'));

    // Handle toggle events
    this.addEventListener('toggle', (e) => {
      const target = e.target;
      
      if (e.detail.on) {
        this.history.push(target);
        
        if (this.history.length > 2) {
          const toTurnOff = this.history[this.history.length - (Math.random() < 0.5 ? 3 : 2)];
          if (toTurnOff) {
            toTurnOff.on = false;
            this.history.splice(this.history.indexOf(toTurnOff), 1);
          }
        }
      } else {
        const index = this.history.indexOf(target);
        if (index > -1) {
          this.history.splice(index, 1);
        }
      }
    });

    // Begin cycling through the options via tab as soon as the user focuses on the widget
    this.addEventListener('focusin', () => {
      this.cycling = true;
    });

    // Handle keydown for focus management
    this.addEventListener('keydown', (e) => {
      // Allow the user to disable cycling by escape key
      if (e.key === 'Escape') {
        this.cycling = false;
        return;
      }

      if (e.key === 'Tab') {
        const currentIndex = this.switches.indexOf(document.activeElement);
        if (currentIndex === -1) return; // Only handle tabbing if focus is on one of our switches
        const currentSwitch = this.switches[currentIndex];
        const editing = currentSwitch.isEditing;
        if (editing) currentSwitch.stopEditing(true);

        let nextIndex = currentIndex + (e.shiftKey ? -1 : 1);
        // If not cycling, don't hijack tab behavior that moves us off the widget
        if (!this.cycling && (nextIndex < 0 || nextIndex >= 3)) return;
        // Otherwise, do hijack tab behavior and instead focus on the next switch!
        e.preventDefault();

        nextIndex = (nextIndex + 3) % 3;
        const nextSwitch = this.switches[nextIndex];

        nextSwitch.focus();
        if (editing) nextSwitch.startEditing();
      }
    });
  }
}

customElements.define('two-of-three', TwoOutOfThree);
