class SwitchItem extends HTMLElement {
  constructor() {
    super();
    this._on = false;
    this.isEditing = false;
  }

  connectedCallback() {
    const text = this.getAttribute('text') || 'Label';
    this.innerHTML = `
      <div class="switch-container">
        <span class="label">${text}</span>
        <div class="switch">
          <div class="slider"></div>
        </div>
      </div>
    `;

    const switchEl = this.querySelector('.switch');
    const labelEl = this.querySelector('.label');

    // Switch click handler
    switchEl.addEventListener('click', () => {
      this.toggle();
    });

    // Label mousedown handler to start editing
    labelEl.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.startEditing();
    });

    // Make the element focusable
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }

    // Keydown handler for the switch-item
    this.addEventListener('keydown', (e) => {
      if (this.isEditing) {
        // Editing mode key handlers
        if (e.key === 'Enter') {
          e.preventDefault();
          this.stopEditing(true);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          this.stopEditing(false);
        } else if (e.key === 'Tab') {
          e.preventDefault();
          this.stopEditing(true);
          
          // Find parent two-out-of-three component
          const parent = this.closest('two-out-of-three');
          if (parent) {
            const switches = Array.from(parent.querySelectorAll('switch-item'));
            const currentIndex = switches.indexOf(this);
            if (currentIndex !== -1) {
              const nextIndex = e.shiftKey 
                ? (currentIndex === 0 ? switches.length - 1 : currentIndex - 1)
                : (currentIndex + 1) % switches.length;
              const nextSwitch = switches[nextIndex];
              nextSwitch.focus();
              setTimeout(() => nextSwitch.startEditing(), 0);
            }
          }
        }
      } else {
        // Non-editing mode key handlers
        if (e.key === 'Enter') {
          e.preventDefault();
          this.startEditing();
        } else if (e.key === ' ') {
          e.preventDefault();
          this.toggle();
        }
      }
    });
  }

  startEditing() {
    if (this.isEditing) return;
    
    this.isEditing = true;
    const labelEl = this.querySelector('.label');
    const currentText = labelEl.textContent;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = 'label-input';
    input.style.cssText = `
      font-size: 18px;
      color: #333;
      border: 2px solid #667eea;
      border-radius: 4px;
      padding: 2px 6px;
      background: white;
      outline: none;
      width: 100%;
    `;
    
    labelEl.textContent = '';
    labelEl.appendChild(input);
    input.focus();
    input.select();
    
    this._originalText = currentText;
    this._input = input;
    
    // Blur handler saves
    input.addEventListener('blur', () => {
      if (this.isEditing) {
        this.stopEditing(true);
      }
    });
  }

  stopEditing(save) {
    if (!this.isEditing) return;
    
    this.isEditing = false;
    const labelEl = this.querySelector('.label');
    const input = this._input;
    
    if (save && input) {
      const newText = input.value.trim() || this._originalText;
      labelEl.textContent = newText;
      this.setAttribute('text', newText);
    } else {
      labelEl.textContent = this._originalText;
    }
    
    this._input = null;
    this._originalText = null;
    
    // Regain focus after editing
    this.focus();
  }

  toggle() {
    this._on = !this._on;
    const switchEl = this.querySelector('.switch');
    if (switchEl) {
      switchEl.classList.toggle('on', this._on);
    }
    this.dispatchEvent(new CustomEvent('toggle', {
      bubbles: true,
      detail: { on: this._on }
    }));
  }

  set on(value) {
    this._on = value;
    const switchEl = this.querySelector('.switch');
    if (switchEl) {
      switchEl.classList.toggle('on', this._on);
    }
  }

  get on() {
    return this._on;
  }

  focus() {
    super.focus();
  }
}

customElements.define('switch-item', SwitchItem);
