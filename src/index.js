import React from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';

import reportWebVitals from './utils/reportWebVitals';
import { parseJsonProps, getComponentById, registerComponent } from './utils/mapping';

import './index.css';
import './components/about/about.css';
import './components/contacts/contacts.css';
import './components/experience/experience.css';
import './components/fold/fold.css';
import './components/hobbies/hobbies.css';
import './components/menu/menu.css';


import { default as About } from './components/about/about';
import { default as Contacts } from './components/contacts/contacts';
import { default as Experience } from './components/experience/experience';
import { default as Fold } from './components/fold/fold';
import { default as Hobbies } from './components/hobbies/hobbies';
import { default as Menu } from './components/menu/menu';


registerComponent("about", About);
registerComponent("fold", Fold);
registerComponent("experience", Experience);
registerComponent("hobbies", Hobbies);
registerComponent("contacts", Contacts);
registerComponent("menu", Menu);

const roots = document.querySelectorAll('[data-react-component]');

window.addEventListener("load", (event) => {
});


roots.forEach(root => {

  const componentId = root.dataset.reactComponent;
  const componentJsonProps = root.dataset.reactProps;
  const Component = getComponentById(componentId);

  const temp = createRoot(root);

  if (Component != null) {
    temp.render(
      <React.StrictMode>
        <Component />
      </React.StrictMode>
    );
  }
})


function tick() {

  
}



setInterval(tick, 30);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
