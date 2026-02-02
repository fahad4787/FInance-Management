/**
 * TSSelect and TSDatePicker Web Components - register on load
 */

class TSSelect extends HTMLElement {
  connectedCallback() {
    this.init();
  }

  init() {
    this.selectId = crypto.randomUUID();
    this.body = document.querySelector('body');
    this.select = this.querySelector('select');
    if (!this.select) {
      throw new Error('Invalid element within ts-select, expected <SELECT> element');
    }
    this.createUI();
    this.addEventListeners();
  }

  createUI() {
    this.tsSelectWrapper = document.createElement('div');

    this.tsSelectTrigger = document.createElement('input');
    this.tsSelectTrigger.setAttribute('popovertarget', this.selectId);
    this.tsSelectTrigger.setAttribute('popovertargetaction', 'toggle');
    this.tsSelectTrigger.setAttribute('tabindex', 0);
    this.setSelectTriggerValue();

    this.tsSelectDropdown = document.createElement('div');
    this.tsSelectDropdown.setAttribute('id', this.selectId);
    this.tsSelectDropdown.setAttribute('popover', '');
    this.tsSelectDropdown.setAttribute('dropdown', '');

    this.tsSelectWrapper.append(this.select, this.tsSelectTrigger, this.tsSelectDropdown);

    this.append(this.tsSelectWrapper);
  }

  addEventListeners() {
    this.select.addEventListener('change', this.updateUI.bind(this));
    const evts = ['click', 'touchstart'];
    evts.forEach((event) =>
      this.tsSelectTrigger.addEventListener(event, (e) => {
        this.setIndex();
        this.propagateSelectDropdown(e);
        this.showDropdown(e);
      })
    );

    this.tsSelectTrigger.addEventListener('input', (e) => {
      this.setIndex();
      this.propagateSelectDropdown(e);
      this.showDropdown(e);
    });

    this.addEventListener('keydown', (e) => {
      this.setIndex();
      this.handleKey(e);
    });
    const calcEvents = ['resize', 'orientationchange', 'scroll'];
    calcEvents.forEach((event) =>
      window.addEventListener(event, this.calculateSelectDropdownPosition.bind(this))
    );

    this.tsSelectDropdown.addEventListener('toggle', () =>
      this.tsSelectDropdown.querySelector('[selected]')?.scrollIntoView({ behavior: 'instant', block: 'center' })
    );
  }

  setIndex() {
    if (!this.index) this.index = 0;
  }

  updateUI() {
    this.setSelectTriggerValue();
  }

  showDropdown() {
    this.calculateSelectDropdownPosition();
    this.tsSelectDropdown.showPopover();
    this.dropdownShown = true;
  }

  hideDropdown() {
    this.tsSelectDropdown.hidePopover();
    this.dropdownShown = false;
    this.options = [];
  }

  setSelectTriggerValue() {
    this.tsSelectTrigger.value = this.select.options[this.select.options.selectedIndex].text;
  }

  selectOption(e) {
    this.index = this.select.selectedIndex = e.target.dataset.index;
    this.querySelectorAll('li').forEach((option, index) => {
      option.removeAttribute('selected');
      if (index == this.select.selectedIndex) option.setAttribute('selected', '');
    });
    this.select.dispatchEvent(new Event('change', { bubbles: true }));
    this.hideDropdown(e);
  }

  calculateSelectDropdownPosition() {
    const trigger = this.tsSelectTrigger.getBoundingClientRect();
    this.tsSelectDropdown.style.setProperty('--left', trigger.left + 'px');
    this.tsSelectDropdown.style.setProperty('--top', trigger.bottom + window.scrollY + 4 + 'px');
    this.tsSelectDropdown.style.setProperty('--width', trigger.right - trigger.left + 'px');
  }

  setBaseOptions() {
    this.options = [];
    const baseOptions = [...this.select.options];
    baseOptions.forEach((option, index) => {
      this.options.push({
        text: option.textContent,
        value: option.value,
        index: index
      });
    });
  }

  propagateSelectDropdown(e) {
    this.setBaseOptions();
    this.tsSelectDropdown.innerHTML = '';

    if (e.type == 'input' && (e.code != 'ArrowDown' || e.code != 'ArrowUp')) {
      this.index = 0;
      let searchword = e.target.value.toLowerCase();
      this.options = this.options.filter((option) => option.text.toLowerCase().includes(searchword));
      if (this.options.length == 1)
        this.querySelector(`li[data-index="${this.options[0].index}"]`);
      if (e.target.value.length == 0) {
        searchword = this.options[this.select.selectedIndex].text;
        this.setBaseOptions();
      }
    }

    const fragment = new DocumentFragment();
    const tsSelectDropdownList = document.createElement('ul');

    this.options.map((option) => {
      const opt = document.createElement('li');
      opt.textContent = option.text;
      opt.value = option.value;
      opt.setAttribute('data-index', option.index);
      opt.setAttribute('tabindex', 0);
      if (option.index == this.select.options.selectedIndex) {
        opt.setAttribute('selected', '');
        opt.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      opt.addEventListener('click', this.selectOption.bind(this));
      tsSelectDropdownList.append(opt);
    });
    fragment.append(tsSelectDropdownList);
    this.tsSelectDropdown.append(fragment);

    this.options = this.querySelectorAll('li');
  }

  handleKey(e) {
    if (!this.options || this.options.length == 0) this.propagateSelectDropdown(e);

    if (e.code == 'ArrowDown') {
      e.preventDefault();
      this.showDropdown();
      this.index++;
      if (this.index > this.options.length - 1) this.index = 0;
      this.options[this.index].focus();
    }
    if (e.code == 'ArrowUp') {
      e.preventDefault();
      this.showDropdown();
      this.index--;
      if (this.index < 0) this.index = this.options.length - 1;
      this.options[this.index].focus();
    }
    if (e.code == 'Enter' || e.code == 'Space') {
      if (this.dropdownShown && this.options.length == 1) this.options[0].click();
      if (this.dropdownShown) this.selectOption(e);
    }
  }
}

class TSDatePicker extends HTMLElement {
  connectedCallback() {
    this.locale = 'en';

    this.input = this.querySelector('input');
    this.date = this.input.value || new Date().toISOString().split('T')[0];

    this.yearSpan = this.hasAttribute('yearspan') ? Number(this.getAttribute('yearspan')) : 20;
    this.placeholder = this.input.hasAttribute('placeholder') ? this.input.getAttribute('placeholder') : this.date;

    if (this.input.value == '') this.input.setAttribute('placeholder', this.placeholder);

    this.render();
  }

  render() {
    this.icon = document.createElement('button');
    this.append(this.icon);
    this.calendarWrapper = document.createElement('dialog');
    this.calendarContent = document.createElement('div');
    this.calendarContent.setAttribute('calendar', '');

    this.yearSelect = this.populateYearSelect(this.yearSpan);
    this.monthSelect = this.populateMonthSelect();
    this.cal = this.renderCalendar(this.date);
    this.calendarContent.append(this.yearSelect, this.monthSelect, this.cal);

    this.calendarWrapper.append(this.calendarContent);
    this.append(this.calendarWrapper);

    this.bindEvents();
  }

  populateYearSelect(span = 10) {
    const fragment = new DocumentFragment();
    const currentYear = new Date().getFullYear();
    const tsSelect = document.createElement('ts-select');
    tsSelect.setAttribute('year', '');
    this.selectYear = document.createElement('select');
    let index = 0;
    for (let y = currentYear - span; y <= currentYear + span; y++) {
      const option = document.createElement('option');
      option.value = y;
      option.text = y;
      option.setAttribute('index', index);
      index++;
      if (y == this.date.split('-')[0]) option.selected = true;
      this.selectYear.append(option);
    }
    tsSelect.append(this.selectYear);
    fragment.append(tsSelect);
    return fragment;
  }

  populateMonthSelect() {
    const fragment = new DocumentFragment();
    const currentMonth = Number(this.date.split('-')[1]) - 1;
    const tsSelect = document.createElement('ts-select');
    tsSelect.setAttribute('month', '');
    this.selectMonth = document.createElement('select');
    for (let m = 1; m <= 12; m++) {
      const option = document.createElement('option');
      option.value = String(m).padStart(2, '0');
      option.text = new Date(2000, m - 1, 1).toLocaleString(this.locale, { month: 'long' });
      if (m - 1 == currentMonth) option.selected = true;
      this.selectMonth.append(option);
    }
    tsSelect.append(this.selectMonth);
    fragment.append(tsSelect);
    return fragment;
  }

  renderCalendar(date) {
    let year = Number(date.split('-')[0]);
    let month = Number(date.split('-')[1]) - 1;
    let day = Number(date.split('-')[2]);

    const fragment = new DocumentFragment();
    const calendar = document.createElement('div');
    calendar.setAttribute('cal', '');

    for (let i = 0; i <= 6; i++) {
      const weekday = document.createElement('div');
      weekday.textContent = new Intl.DateTimeFormat(this.locale, { weekday: 'narrow' }).format(
        new Date(2023, 7, i)
      );
      calendar.append(weekday);
    }

    let firstDayOfMonth =
      new Date(year, month, 1).getDay() - 1 === -1 ? 6 : new Date(year, month, 1).getDay() - 1;
    let lastDateOfMonth = new Date(year, month + 1, 0).getDate();
    let lastDayOfMonth =
      new Date(year, month, lastDateOfMonth).getDay() - 1 == -1
        ? 6
        : new Date(year, month, lastDateOfMonth).getDay() - 1;
    let lastDateOfLastMonth = new Date(year, month, 0).getDate();

    for (let i = firstDayOfMonth; i > 0; i--) {
      const d = document.createElement('button');
      d.setAttribute('prev', '');
      d.textContent = lastDateOfLastMonth - i + 1;
      const dateStr = `${month == 0 ? year - 1 : year}-${month == 0 ? 12 : String(month).padStart(2, '0')}-${String(lastDateOfLastMonth - i + 1).padStart(2, '0')}`;
      d.addEventListener('click', () => {
        this.dayChange(dateStr);
      });
      calendar.append(d);
    }

    for (let i = 1; i <= lastDateOfMonth; i++) {
      const d = document.createElement('button');
      d.setAttribute('curr', '');
      d.textContent = i;
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      if (i == day) d.setAttribute('selected', '');
      d.addEventListener('click', () => {
        this.dayChange(dateStr);
      });
      calendar.append(d);
    }

    for (let i = lastDayOfMonth; i < 6; i++) {
      const d = document.createElement('button');
      d.setAttribute('next', '');
      d.textContent = i - lastDayOfMonth + 1;
      const dateStr = `${month == 11 ? year + 1 : year}-${month == 11 ? String(1).padStart(2, '0') : String(month + 2).padStart(2, '0')}-${String(i - lastDayOfMonth + 1).padStart(2, '0')}`;
      d.addEventListener('click', () => {
        this.dayChange(dateStr);
      });
      calendar.append(d);
    }

    fragment.append(calendar);
    return fragment;
  }

  dayChange(date) {
    this.selectMonth.selectedIndex = Number(date.split('-')[1] - 1);
    this.selectYear.selectedIndex = [...this.selectYear.options].findIndex(
      (option) => option.value == date.split('-')[0]
    );
    this.date = date;
    this.input.value = this.date;
    this.input.setAttribute('value', this.date);
    this.input.dispatchEvent(new Event('input', { bubbles: true }));
    this.input.dispatchEvent(new Event('change', { bubbles: true }));
    this.calendarContent.querySelector('[cal]').remove();
    this.calendarContent.append(this.renderCalendar(this.date));
  }

  monthSelectChange() {
    let date = this.date.split('-');
    date[1] = this.selectMonth.options[this.selectMonth.selectedIndex].value;
    this.date = date.join('-');
    this.input.value = this.date;
    this.input.setAttribute('value', this.date);
    this.input.dispatchEvent(new Event('input', { bubbles: true }));
    this.calendarContent.querySelector('[cal]').remove();
    this.calendarContent.append(this.renderCalendar(this.date));
  }

  yearSelectChange() {
    let date = this.date.split('-');
    date[0] = this.selectYear.options[this.selectYear.selectedIndex].value;
    this.date = date.join('-');
    this.input.value = this.date;
    this.input.setAttribute('value', this.date);
    this.input.dispatchEvent(new Event('input', { bubbles: true }));
    this.calendarContent.querySelector('[cal]').remove();
    this.calendarContent.append(this.renderCalendar(this.date));
  }

  bindEvents() {
    this.icon.addEventListener('click', this.openDialog.bind(this));
    this.input.addEventListener('click', this.openDialog.bind(this));
    this.calendarWrapper.addEventListener('click', this.dismissDialog.bind(this));
    this.selectYear.addEventListener('change', this.yearSelectChange.bind(this));
    this.selectMonth.addEventListener('change', this.monthSelectChange.bind(this));
    document.addEventListener('mousedown', this.registerMouse.bind(this));
    window.addEventListener('resize', this.closeDialog.bind(this));
    window.addEventListener('orientationchange', this.closeDialog.bind(this));

    this.calendarWrapper.addEventListener('toggle', () => {
      if (this.calendarWrapper.open) requestAnimationFrame(() => this.calclulateDialogPosition());
    });

    this.input.addEventListener('keydown', this.manualDate.bind(this));
  }

  manualDate(e) {
    const date = e.target.value.length == 10 ? e.target.value : this.date;
    if (e.key == 'Enter') this.dayChange(date);
  }

  calclulateDialogPosition() {
    const rect = this.input.getBoundingClientRect();
    const dialogRect = this.calendarWrapper.getBoundingClientRect();

    let top = rect.bottom + 4;
    let left = rect.left;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if (windowWidth < rect.left + dialogRect.width) left = rect.left - dialogRect.width + rect.width;

    if (windowHeight < rect.bottom + dialogRect.bottom)
      top = rect.bottom - dialogRect.height - rect.height - 4;

    this.calendarWrapper.style.setProperty('--top', top + 'px');
    this.calendarWrapper.style.setProperty('--left', left + 'px');
  }

  closeDialog() {
    this.calendarWrapper.close();
  }

  dismissDialog(e) {
    const rect = e.target.getBoundingClientRect();
    if (
      (rect.left > this.mouseX ||
        rect.right < this.mouseX ||
        rect.top > this.mouseY ||
        rect.bottom < this.mouseY) &&
      e.target.parentNode?.nodeName == 'TS-DATE-PICKER'
    )
      this.calendarWrapper.close();
  }

  registerMouse(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  }

  openDialog() {
    this.date = this.input.value || new Date().toISOString().split('T')[0];
    this.calendarWrapper.showModal();
    requestAnimationFrame(() => this.calclulateDialogPosition());
  }
}

if (typeof window !== 'undefined' && !window.customElements.get('ts-select')) {
  window.customElements.define('ts-select', TSSelect);
}
if (typeof window !== 'undefined' && !window.customElements.get('ts-date-picker')) {
  window.customElements.define('ts-date-picker', TSDatePicker);
}
