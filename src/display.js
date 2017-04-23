;(function() {
  var tableHeaders = ['Name', 'Version', 'Latest', 'Description']
  var open =
    '\
    <svg class="octicon octicon-chevron-down" viewBox="0 0 10 16" version="1.1" width="15" height="26" aria-hidden="true">\
      <path fill-rule="evenodd" d="M5 11L0 6l1.5-1.5L5 8.25 8.5 4.5 10 6z">\
      </path>\
    </svg>'
  var closed =
    '\
    <svg class="octicon octicon-chevron-right" viewBox="0 0 8 16" version="1.1" width="12" height="24" aria-hidden="true">\
      <path fill-rule="evenodd" d="M7.5 8l-5 5L1 11.5 4.75 8 1 4.5 2.5 3z">\
      </path>\
    </svg>'

  function display(deps, devDeps, config) {
    var readme = document.querySelector('.markdown-body.entry-content')
    var license = document.querySelector('#user-content-license')
    var header = document.createElement('h2')
    var table = document.createElement('table')
    var body = document.createElement('tbody')

    header.textContent = 'Dependencies (' + config.name + ')'
    header.title = 'Toggle ' + config.name + ' table display'
    header.onclick = toggleTable
    header.style.display = 'none'
    table.style.display = 'none'
    tableHeaders.forEach(addTableHeader)
    table.appendChild(body)

    license = license ? license.parentNode : null
    readme.insertBefore(header, license)
    readme.insertBefore(table, license)

    addDependencies(body, deps, config.registry, config.name)
    addDependencies(body, devDeps, config.registry, config.name, true)

    function addTableHeader(header) {
      var tableHeader = document.createElement('th')
      tableHeader.textContent = header
      table.appendChild(tableHeader)
    }

    function toggleTable() {
      toggle(table)
    }
  }

  function addDependencies(body, deps, registry, name, dev) {
    var className = name + (dev ? 'dep' : 'devDep')
    if (deps) {
      body.appendChild(subHeader(dev, className))
    }

    for (depName in deps) {
      var row = document.createElement('tr')
      row.className = className
      addName(row, depName)
      addVersion(row, deps[depName])
      addVersion(row, '-')
      row.appendChild(document.createElement('td')) // description
      body.appendChild(row)

      window.getExtraPackageData(registry, depName, addExtraData.bind(row))
    }
  }

  function subHeader(dev, className) {
    var row = document.createElement('tr')
    var td = document.createElement('td')
    var header = document.createElement('strong')

    header.textContent = dev
      ? 'Development Dependencies'
      : 'Project Dependencies'
    td.colSpan = tableHeaders.length
    row.style.cursor = 'pointer'
    row.onclick = toggleDependencies
    td.appendChild(header)
    var icon = document.createElement('div')
    icon.style.float = 'right'
    icon.innerHTML = open
    td.appendChild(icon)
    row.appendChild(td)

    return row

    function toggleDependencies() {
      var rows = document.getElementsByClassName(className)
      for (var i = 0; i < rows.length; i++) {
        toggle(rows[i])
      }
      var icon = td.getElementsByTagName('div')[0]
      icon.innerHTML = icon.innerHTML === open ? closed : open
    }
  }

  function addName(row, name) {
    var td = document.createElement('td')
    var anchor = document.createElement('a')
    anchor.textContent = name
    td.appendChild(anchor)
    row.appendChild(td)
  }

  function addVersion(row, version) {
    var td = document.createElement('td')
    var code = document.createElement('code')
    if (typeof version === 'object') {
      version = version.version || version.path || '-'
    }
    code.textContent = version
    td.appendChild(code)
    row.appendChild(td)
  }

  function addExtraData(latestVersion, description, homepage) {
    data = this.getElementsByTagName('td')
    if (homepage) {
      data[0].children[0].setAttribute('href', homepage)
    }
    data[2].children[0].textContent = latestVersion
    data[3].textContent = description
    var table = this.parentNode.parentNode
    var header = table.previousSibling

    table.style.display = ''
    header.style.display = ''
    header.style.cursor = 'pointer'
  }

  function toggle(element) {
    element.style.display = element.style.display === 'none' ? '' : 'none'
  }

  window.display = display
})()
