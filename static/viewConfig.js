'use strict';

(() => {
  const loaderEl = document.getElementById('loader');
  loaderEl.classList.add('visible');

  new Clipboard('.btn');

  function request (url) {
    return new Promise((resolve, reject) => {
      const xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
          const response = xmlHttp.responseText;
          let formattedResponse;

          try {
            formattedResponse = JSON.parse(response);
          } catch (err) {
            return reject('Could not format data');
          }
          return resolve(formattedResponse);
        } else if (xmlHttp.status === 502) {
          return reject('Could not get data');
        }
      };
      xmlHttp.open('POST', url, true);
      xmlHttp.send(null);
    });
  }

  function attachListeners (data) {
    const selectedSlotTab = document.querySelector('.slot-tab.selected');
    const selectedSlotTabId = selectedSlotTab && selectedSlotTab.id;

    data.forEach((skillData) => {
      document.getElementById(skillData.skillName).onclick = () => {
        const selfTab = document.getElementById(skillData.skillName);
        const intentSchemaEl = document.getElementById('intentSchema');
        const sampleUtterancesEl = document.getElementById('sampleUtterances');
        const slotValuesEl = document.getElementById('slotValues');
        const slotTypeEl = document.getElementById('slotType');

        // add "selected" class
        data.forEach((skillData) => {
          document.getElementById(skillData.skillName).classList.remove('selected');
        });
        selfTab.classList.add('selected');

        // Fill textareas
        intentSchemaEl.value = JSON.stringify(skillData.intentSchema, null, 2);
        sampleUtterancesEl.value = skillData.sampleUtterances.join('\n');
        slotValuesEl.value = '';

        const slotTabs = document.getElementById('slot-tabs');
        slotTabs.innerHTML = '';

        skillData.slotValues.forEach((slotValue, i) => {
          slotTabs.innerHTML += `<div id="${slotValue.name + '-' + i}" class="slot-tab">${slotValue.name}</div>`;
        });

        skillData.slotValues.forEach((slotValue, i) => {
          const selfSlotTab = document.getElementById(slotValue.name + '-' + i);
          selfSlotTab.onclick = () => {
            slotValuesEl.value = slotValue.values.join('\n');
            slotTypeEl.value = slotValue.type;

            // add "selected" class
            skillData.slotValues.forEach((slotVal, j) => {
              document.getElementById(slotVal.name + '-' + j).classList.remove('selected');
            });
            selfSlotTab.classList.add('selected');
          };

          if (i === 0 || (selectedSlotTabId && selfSlotTab.id === selectedSlotTabId)) {  // select first as default
            window.setTimeout(() => {
              selfSlotTab.click();
            }, 0);
          }
        });
      };
    });
  }

  function showConfiguration (data) {
    const selected = document.querySelector('.tab.selected');
    document.getElementById('tabs').innerHTML = '';

    data.forEach((skillData) => {
      const selectedClass = selected && selected.id === skillData.skillName ? 'selected' : '';
      const tab = `<div id="${skillData.skillName}" class="tab ${selectedClass}">${skillData.skillName}</div>`;
      document.getElementById('tabs').innerHTML += tab;
    });
  }

  function showExposedUrl (exposedData) {
    document.getElementById('url').value = '';
    if (exposedData && exposedData.exposedUrl) {
      document.getElementById('url').value = exposedData.exposedUrl;
    }
  }

  function updateView (data) {
    const schemaData = data.schemas;
    const exposedData = data.exposed;

    // Cleanup
    document.getElementById('intentSchema').value = '';
    document.getElementById('sampleUtterances').value = '';
    document.getElementById('slotValues').value = '';

    // Update
    showConfiguration(schemaData);
    attachListeners(schemaData);
    showExposedUrl(exposedData);

    // Reselect
    const selectedTab = document.querySelector('.tab.selected');
    const selectedSlotTab = document.querySelector('.slot-tab.selected');
    if (selectedTab) {
      selectedTab.click();
    }
    if (selectedSlotTab) {
      selectedSlotTab.click();
    }

  }

  let currentData;
  setInterval(() => {
    request(window.location.href)
      .then((data) => {
        if (loaderEl.classList.contains('visible')) {
          loaderEl.classList.remove('visible');
        }
        if (JSON.stringify(currentData) !== JSON.stringify(data)) {
          currentData = data;
          updateView(data);
        }
      })
      .catch((err) => {
        if (!loaderEl.classList.contains('visible')) {
          loaderEl.classList.add('visible');
        }
        const loaderTextEl = document.getElementById('loader-text');
        loaderTextEl.innerHTML = loaderTextEl.innerHTML && loaderTextEl.innerHTML.indexOf('...') !== -1 ? 'Loading' : loaderTextEl.innerHTML + '.';
        console.log(err);
      });
  }, 1000);
})();