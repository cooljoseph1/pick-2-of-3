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

    // Keydown handler for the switch-item
    this.addEventListener('keydown', (e) => {
      if (this.isEditing) {
        // Editing mode key handlers
        if (e.key === 'Enter') {
          e.preventDefault();
          this.stopEditing(true);
          this.focus();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation(); // Prevent escape from bubbling to parent
          this.stopEditing(false);
          this.focus();
        } else if (e.key === 'Tab') {
          e.preventDefault();
          this.focus();
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
    
    labelEl.textContent = '';
    labelEl.appendChild(input);
    input.focus();
    input.select();
    
    this._originalText = currentText;
    this._input = input;
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
