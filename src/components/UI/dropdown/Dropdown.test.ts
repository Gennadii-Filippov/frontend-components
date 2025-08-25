import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import Dropdown from './DropDown.vue';
import PerfectScrollbar from 'perfect-scrollbar';
vi.mock('perfect-scrollbar');
describe('Dropdown tests', () => {
  const mockData = [
    { label: 'Item 1', active: false, link: '/item1' },
    { label: 'Item 2', active: true, link: '/item2' },
    { label: 'Item 3', active: false, link: '/item3' },
  ];

  it('renders correctly with initial data', () => {
    const wrapper = mount(Dropdown, {
      props: { data: mockData },
    });

    const activeItem = wrapper.find('.dropdown__select-now');
    expect(activeItem.text()).toBe('Item 2'); // Initially active item
  });

  it('toggles dropdown list visibility', async () => {
    const wrapper = mount(Dropdown, {
      props: { data: mockData },
    });

    const dropdown = wrapper.find('.dropdown__select-now');
    const dropdownList = wrapper.find('.dropdown__list');

    expect(dropdownList.classes()).not.toContain('show');

    await dropdown.trigger('click');
    expect(dropdownList.classes()).toContain('show');

    await dropdown.trigger('click');
    expect(dropdownList.classes()).not.toContain('show');
  });

  it('emits "onSelect" event when an item is selected', async () => {
    const wrapper = mount(Dropdown, {
      props: { data: mockData },
    });

    const items = wrapper.findAll('.dropdown__select');
    await items[0].trigger('click');
    const emit = wrapper.emitted().onSelect as {
      label: string;
      active: boolean;
    }[][];
    expect(emit).toHaveLength(1);
    const emittedData = emit[0][0];
    expect(emittedData).toEqual(mockData[0]);
  });

  it('updates active item when props.data changes', async () => {
    const wrapper = mount(Dropdown, {
      props: { data: mockData },
    });

    const newData = [
      { label: 'New Item 1', active: true, link: '/new-item1' },
      { label: 'New Item 2', active: false, link: '/new-item2' },
    ];

    // @ts-ignore
    await wrapper.setProps({ data: newData });

    const activeItem = wrapper.find('.dropdown__select-now');
    expect(activeItem.text()).toBe('New Item 1');
  });

  it('closes the dropdown list when clicking outside', async () => {
    const wrapper = mount(Dropdown, {
      props: { data: mockData },
      attachTo: document.body,
    });

    const dropdown = wrapper.find('.dropdown__select-now');
    await dropdown.trigger('click');

    expect(wrapper.find('.dropdown__list').classes()).toContain('show');

    await document.body.click();
    expect(wrapper.find('.dropdown__list').classes()).not.toContain('show');
  });

  it('initializes PerfectScrollbar when addScroll is true', () => {
    mount(Dropdown, {
      props: { data: mockData, addScroll: true },
    });

    expect(PerfectScrollbar).toHaveBeenCalled();
  });
});
