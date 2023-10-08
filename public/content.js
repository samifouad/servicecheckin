(async () => {
    
    function getPage (params) {
        let form = '';
        let tab = '';
        let name = '';

        if (params.get('form_name')) {
            form = params.get('form_name');
        }

        if (params.get('tab')) {
            tab = params.get('tab');
        }

        if (params.get('name')) {
            name = params.get('name');
        }

        if (form === 'ui_tab' && tab === 'service') {
            return 'service';
        }

        if (form === 'view' && tab === 'details' && name === 'workbench.views.beta_workorder') {
            return 'workorder';
        }

        if (form === 'listing' && name === 'workbench.listings.workorders_agenda') {
            return 'agenda';
        }

        return 'unknown';
    }

    function logPage (page) {
        switch (page) {
            case 'workorder':
                console.log('rendered: workorder page');

                chrome.storage.local.set({pageState: 'workorder'});
            
                // check for empty workorder notes
                // if(checkEmptyNotes()) {

                //     // check for qDiv
                //     if(checkQuestionBox()) {
                //         // do nothing
                //     } else {
                //         (async () => {
                //             try {
                //                 const result = await renderState();
                //                 console.log(result);
                //             } catch (error) {
                //                 console.error(error);
                //             }
                //         })();
                //     }
                // }
            break;
            case 'service':
                console.log('rendered: service page');

                chrome.storage.local.set({pageState: 'service'});
                //removeOnClickFromChildren('recent_records_workorders_section');
            break;
            case 'agenda':
                console.log('rendered: agenda page');

                chrome.storage.local.set({pageState: 'agenda'});
            break;
            default:
                console.log('rendered: unknown page');

                chrome.storage.local.set({pageState: 'unknown'});
            break;
        }
    }

    function removeOnClickFromChildren(id) {
        var parentElem = document.getElementById(id);
        
        if (!parentElem) {
            console.error('Parent element not found:', id);

        } else {
        
            var children = parentElem.querySelectorAll('a');

            children.forEach(function(child) {
                child.removeAttribute('onclick');
            });
        }
    }

    function hideHeaderColumns(tableClass, columnIndices) {
        const table = document.querySelector('.' + tableClass);
        if (!table) {
            console.error('No table found with class:', tableClass);
            return;
        }

        const headRows = table.querySelectorAll('thead tr');
        headRows.forEach(row => {
            columnIndices.forEach(index => {
                const cell = row.querySelector(`th:nth-child(${index + 1})`);
                if (cell) {
                    cell.style.display = 'none';
                }
            });
        });
    }

    function hideBodyColumns(tableClass, columnIndices) {
        const table = document.querySelector('.' + tableClass);
        if (!table) {
            console.error('No table found with class:', tableClass);
            return;
        }

        const bodyRows = table.querySelectorAll('tbody tr');
        bodyRows.forEach(row => {
            if (!row.classList.contains('row-spacer')) {
                columnIndices.forEach(index => {
                    const cell = row.querySelector(`td:nth-child(${index + 1})`);
                    if (cell) {
                        cell.style.display = 'none';
                    }
                });
            }
        });
    }

    function checkEmptyNotes() {
        console.log('checking for empty workorder notes');

        const note_textarea = document.getElementById('noteTextArea');
        const internal_textarea = document.getElementById('internal_note');

        if (note_textarea.value.trim() === '' && internal_textarea.value.trim() === '') {
            console.log('detected empty workorder notes');
            return true;
        }
        return false;
    }

    function checkQuestionBox() {
        console.log('checking for question box');

        if (document.getElementById('qDiv')) {
            return true;
        } else {
            return false;
        }
    }

    function createQuestionBox(selectedDivId, newDivId) {
        // Check if a div with the newDivId already exists
        if (document.getElementById(newDivId)) {
            console.log('Div with id', newDivId, 'already exists');
        }
    
        // Select the existing div from the DOM
        const selectedDiv = document.getElementById(selectedDivId);
    
        // Check if the selected div exists
        if (selectedDiv) {
            // Create a new div element
            const newDiv = document.createElement('div');
        
            // Assign an id to the new div
            newDiv.id = newDivId;
        
            // Append the new div to the selected div
            selectedDiv.appendChild(newDiv);

            console.log('created new question box');
        } else {
            console.error('No div found with id:', selectedDivId);
        }
    }

    function runWorkorderPageStyleMod() {
        // make receipt notes bigger
        let receiptNotes = document.getElementById("noteTextArea");
        receiptNotes.rows = 20;

        // make internal note bigger
        let internalNotes = document.getElementById("internal_note");
        internalNotes.rows = 20;

        // make description field bigger
        let description = document.getElementById("serial_description");
        description.size = 60;
        description.style = "font-size: 24px; line-height: 28px; padding: 4px;";

        // hide customer serialized item drop down
        let dropdownSerialized = document.getElementById("edit_workorder_serialized_id");
        if (dropdownSerialized) {
            let dropdownSerializedParent = dropdownSerialized.closest('.fieldgroup');
            dropdownSerializedParent.style.visibility = 'hidden';
        }

        // hide warranty checkbox
        let checkboxWarranty = document.getElementById("warrantyCheckbox");
        if (checkboxWarranty) {
            let checkboxWarrantyParent = checkboxWarranty.closest('.checkbox');
            checkboxWarrantyParent.style.visibility = 'hidden';
        }

        // hide save parts checkbox
        let checkboxPartsCheckbox = document.getElementById("savePartsCheckbox");
        if (checkboxPartsCheckbox) {
            let checkboxPartsCheckboxParent = checkboxPartsCheckbox.closest('.checkbox');
            checkboxPartsCheckboxParent.style.visibility = 'hidden';
        }

        // hide add time select input
        let addTimeSelect = document.getElementById("add-time");
        if (addTimeSelect) {
            let addTimeSelectParent = addTimeSelect.closest('div');
            addTimeSelectParent.style.visibility = 'hidden';
        }

        // hide date in calendar picker
        let dateInSelect = document.getElementById("workorder_edit_time_in_field");
        if (dateInSelect) {
            let dateInSelectParent = dateInSelect.closest('li');
            dateInSelectParent.remove();
        }

        // hide assign all lines checkbox
        let assignAllLinesCheckbox = document.getElementById("assignEmployeeToAllCheckbox");
        if (assignAllLinesCheckbox) {
            let assignAllLinesCheckboxParent = assignAllLinesCheckbox.closest('li');
            assignAllLinesCheckboxParent.remove();
        }

        // hide useless description input box
        let serial_colorBox = document.getElementById("serial_color");
        if (serial_colorBox) {
            let serial_colorBoxParent = serial_colorBox.closest('li');
            serial_colorBoxParent.remove();
        }

        // hide useless description input box
        let serial_sizeBox = document.getElementById("serial_size");
        if (serial_sizeBox) {
            let serial_sizeBoxBoxParent = serial_sizeBox.closest('li');
            serial_sizeBoxBoxParent.remove();
        }

        // hide useless description input box
        let serial_serialBox = document.getElementById("serial_serial");
        if (serial_serialBox) {
            let serial_serialBoxParent = serial_serialBox.closest('li');
            serial_serialBoxParent.remove();
        }

        // hide useless description input box
        let addImagesBox = document.getElementsByClassName("workorder-image-container")[0];
        if (addImagesBox) {
            addImagesBox.remove();
        }

        // hide useless archive button
        let archiveButton = document.getElementsByClassName("archive")[0];
        if (archiveButton) {
            archiveButton.remove();
        }

        // hide useless send as email button
        let sendEmailButton = document.querySelector('[title="Send As Email"]');
        if (sendEmailButton) {
            sendEmailButton.remove();
        }

        // hide useless archive button
        let hookBoxes = document.getElementsByClassName("workorder-locations")[0];
        if (hookBoxes) {
            hookBoxes.remove();
        }
    }

    function runAgendaPageStyleMod() {
        hideHeaderColumns('table-status-colors', [4, 6, 7, 8, 9]); 
        hideBodyColumns('table-status-colors', [4, 6, 7, 8, 9]); 

        // make customer name bigger
        let cxNames = document.querySelectorAll('[data-automation="cellWorkordersDueCustomer"]');
        cxNames.forEach(cxName => {
            cxName.style.fontSize = '22px';
        });
    }

    function helloWorld() {
        console.log('hello world');
    }

    function runInitialQuestionState() {
        //
        let html = `<div style="width: 100%;background-color:#F3F2ED;border-radius: 10px;min-height: 320px;position: relative;">
        <div style="padding-top: 20px; width: 100%; font-size: 24px; font-weight: bold; text-align: center;">
            What are you signing in?
        </div>

        <div id="qScrollContainer" style="width: 100%; height: 220px; overflow-y: scroll; white-space: nowrap; -webkit-overflow-scrolling: touch; padding-right: 40px; margin-bottom: 15px;">
            <div style="display: inline-block; width: 150px;height: 200px;border: 1px solid #ccc;border-radius: 15px;text-align: center;line-height: 200px;background-color: #FFF;margin-top: 20px;margin-left: 30px;"
                    onClick="helloWorld();">
                Computer
            </div>

            <div style="display: inline-block; width: 150px;height: 200px;border: 1px solid #ccc;border-radius: 15px;text-align: center;line-height: 200px;background-color: #FFF;margin-top: 20px;margin-left: 30px;"
            onClick="helloWorld();">
                Phone
            </div>

            <div style="display: inline-block; width: 150px;height: 200px;border: 1px solid #ccc;border-radius: 15px;text-align: center;line-height: 200px;background-color: #FFF;margin-top: 20px;margin-left: 30px;"
            onClick="helloWorld();">
                TV
            </div>

            <div style="display: inline-block; width: 150px;height: 200px;border: 1px solid #ccc;border-radius: 15px;text-align: center;line-height: 200px;background-color: #FFF;margin-top: 20px;margin-left: 30px;"
            onClick="helloWorld();">
                Tablet
            </div>

            <div style="display: inline-block; width: 150px;height: 200px;border: 1px solid #ccc;border-radius: 15px;text-align: center;line-height: 200px;background-color: #FFF;margin-top: 20px;margin-left: 30px;"
            onClick="helloWorld();">
                Console
            </div>

            <div style="display: inline-block; width: 150px;height: 200px;border: 1px solid #ccc;border-radius: 15px;text-align: center;line-height: 200px;background-color: #FFF;margin-top: 20px;margin-left: 30px;"
            onClick="helloWorld();">
                Other
            </div>
        </div>

        <div style="font-weight: bold;font-size: 15px;padding-right: 10px;padding-bottom: 5px;position: absolute;bottom: 5px;right: 10px;">
            🤓 Service Check-in
        </div>
        </div>`;
        const stateDiv = document.getElementById('qDiv')
        stateDiv.innerHTML = html;
    }

    async function runStyleMod (page) {
        switch (page) {
            case 'workorder':
                console.log('mutating workorder page style');
                runWorkorderPageStyleMod();

                if (checkEmptyNotes()) {
                    console.log('empty notes found, removing them...');
                    const note_textarea = document.getElementById('noteTextArea');
                    const internal_textarea = document.getElementById('internal_note');
                    note_textarea.style.display = 'none';
                    internal_textarea.style.display = 'none';

                    // check for qDiv
                    if (checkQuestionBox() === false) {
                        // do nothing
                        console.log('questions box not found, creating it...');

                        createQuestionBox('workorder_status_wrapper', 'qDiv');

                        console.log('rendering initial question state');
                        runInitialQuestionState();
                    } else {
                        console.log('rendering initial question state');

                        runInitialQuestionState();
                    }
                }
            break;
            case 'service':
                //
            break;
            case 'agenda':
                console.log('mutating agenda page style');
                runAgendaPageStyleMod();
            break;
            default:
                console.log('rendering default page');
            break;
        }
    }

    console.log('Service Check-in extension is activate!');

    chrome.storage.onChanged.addListener(function(changes, namespace) {
        if (namespace === 'local' && changes.pageState) {
            let storageChange = changes.pageState;
            console.log('pageState changed. ' +
                        'was "%s" and now is "%s".',
                        storageChange.oldValue,
                        storageChange.newValue);
            
            runStyleMod(storageChange.newValue);
        }
    });

    // Create an observer instance linked to a callback function
    var observer = new MutationObserver(function(mutationsList, observer) {

        const params = new URLSearchParams(window.location.search)

        let page = getPage(params);

        logPage(page);
    });

    // Start observing the document with configured parameters
    observer.observe(document, { childList: true, subtree: true });

    // log initial page load
    const params = new URLSearchParams(window.location.search)
    let page = getPage(params);
    logPage(page);

    let current = await chrome.storage.local.get('pageState');
    console.log('current page state:', current.pageState);
    await runStyleMod(current.pageState);
})();