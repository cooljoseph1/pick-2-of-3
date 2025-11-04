class TwoOutOfThree extends HTMLElement {
  constructor() {
    super();
    this.history = [];
    this.canEscape = false;
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="switches">
        <switch-item text="Fast" tabindex="0"></switch-item>
        <switch-item text="Good" tabindex="0"></switch-item>
        <switch-item text="Cheap" tabindex="0"></switch-item>
      </div>
    `;

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

    // Handle keydown for focus trapping
    this.addEventListener('keydown', (e) => {
      // Check if a switch-item is being edited
      const isEditing = this.switches.some(sw => sw.isEditing);
      if (isEditing) return;

      if (e.key === 'Escape') {
        this.canEscape = true;
        return;
      }

      if (e.key === 'Tab') {
        const focusedIndex = this.switches.findIndex(sw => sw === document.activeElement);
        
        if (focusedIndex !== -1) {
          if (e.shiftKey) {
            // Shift+Tab - going backwards
            if (focusedIndex === 0 && this.canEscape) {
              // Allow escape at the start
              this.canEscape = false;
              return;
            }
            e.preventDefault();
            const prevIndex = focusedIndex === 0 ? this.switches.length - 1 : focusedIndex - 1;
            this.switches[prevIndex].focus();
            this.canEscape = false;
          } else {
            // Tab - going forwards
            if (focusedIndex === this.switches.length - 1 && this.canEscape) {
              // Allow escape at the end
              this.canEscape = false;
              return;
            }
            e.preventDefault();
            const nextIndex = (focusedIndex + 1) % this.switches.length;
            this.switches[nextIndex].focus();
            this.canEscape = false;
          }
        }
      }
    });
  }
}

customElements.define('two-out-of-three', TwoOutOfThree);
