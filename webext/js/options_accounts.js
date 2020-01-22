var SysTrayX = {};

SysTrayX.Accounts = {
  initialized: false,

  init: function() {
    this.getAccounts().then(this.getAccountsCb);
  },

  /*
   * Use the messages API to get the unread messages (Promise)
   * Be aware that the data is only avaiable inside the callback
   */
  getAccounts: async function() {
    return await browser.accounts.list();
  },

  /*
   * Callback for getAccounts
   */
  getAccountsCb: function(mailAccount) {
    let accounts = new Object();
    let i;

    for (i = 0; i < mailAccount.length; i++) {
      console.debug("SysTrayX accounts id: " + mailAccount[i].id);
      console.debug("SysTrayX accounts name: " + mailAccount[i].name);
      console.debug("SysTrayX accounts type: " + mailAccount[i].type);

      if (!accounts[mailAccount[i].type]) {
        accounts[mailAccount[i].type] = [];
      }
      accounts[mailAccount[i].type].push({
        id: mailAccount[i].id,
        name: mailAccount[i].name,
        folders: mailAccount[i].folders
      });
    }

    /*
     *  Build tree
     */

    // Get base
    let treeBase = document.getElementById("accountsTree");

    for (let prop in accounts) {
      let typeLi = document.createElement("li");

      let typeSpan = document.createElement("span");
      if (accounts[prop]) {
        typeSpan.setAttribute("class", "caret");
      }
      let typeText = document.createTextNode(prop);
      typeSpan.appendChild(typeText);
      typeLi.appendChild(typeSpan);

      if (accounts[prop]) {
        let typeUl = document.createElement("ul");
        typeUl.setAttribute("class", "nested active");

        for (let i = 0; i < accounts[prop].length; ++i) {
          let typeLi = document.createElement("li");
          let typeInput = document.createElement("input");
          typeInput.setAttribute("type", "checkbox");
          typeInput.setAttribute("name", accounts[prop][i].id);
          typeInput.setAttribute("value", JSON.stringify(accounts[prop][i]));
          typeInput.setAttribute("checked", "true");
          typeLi.appendChild(typeInput);
          let typeText = document.createTextNode(" " + accounts[prop][i].name);
          typeLi.appendChild(typeText);
          typeUl.appendChild(typeLi);
        }
        typeLi.appendChild(typeUl);
      }

      treeBase.appendChild(typeLi);

      // Restore saved selection
      function setAccounts(result) {
        console.debug("Restore account selection");

        let treeBase = document.getElementById("accountsTree");
        let accounts = result.accounts || [];
        for (let i = 0; i < accounts.length; ++i) {
          let checkbox = treeBase.querySelector(
            `input[name=${accounts[i].id}]`
          );
          if (checkbox) {
            checkbox.checked = accounts[i].checked;
          }
        }

        console.debug("Restore account selection done");
      }

      function onError(error) {
        console.log(`GetAccounts Error: ${error}`);
      }

      let getAccounts = browser.storage.sync.get("accounts");
      getAccounts.then(setAccounts, onError);
    }

    /*
     *  Activate tree
     */
    let toggler = document.getElementsByClassName("caret");
    for (let i = 0; i < toggler.length; i++) {
      toggler[i].addEventListener("click", function() {
        this.parentElement.querySelector(".nested").classList.toggle("active");
        this.classList.toggle("caret-down");
      });
    }
  }
};

SysTrayX.Accounts.init();
