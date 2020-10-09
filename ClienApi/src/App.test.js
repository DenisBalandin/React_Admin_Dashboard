import React from 'react';
import { render } from '@testing-library/react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { shallow } from "enzyme";
import EditPage from "./components/EditPage";
import AllUsers from "./components/AllUsers";

test("expect component is called at least once", () => {
  const wrapper = shallow(<EditPage />);
  expect(wrapper.find(".LogInForm").length).toEqual(4);
});

test("expect component is called at least once", () => {
  const wrapper = shallow(<AllUsers />);
  expect(wrapper.find(".UserIten").length).toEqual(6);
});

