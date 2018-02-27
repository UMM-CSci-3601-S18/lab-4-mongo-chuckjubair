import {TodoPage} from './todo-list.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

const origFn = browser.driver.controlFlow().execute;

// https://hassantariqblog.wordpress.com/2015/11/09/reduce-speed-of-angular-e2e-protractor-tests/
// browser.driver.controlFlow().execute = function () {
//     let args = arguments;
//
//     // queue 100ms wait between test
//     // This delay is only put here so that you can watch the browser do its thing.
//     // If you're tired of it taking long you can remove this call
//     origFn.call(browser.driver.controlFlow(), function () {
//         return protractor.promise.delayed(100);
//     });
//
//     return origFn.apply(browser.driver.controlFlow(), args);
// };

describe('Todo list', () => {
    let page: TodoPage;

    beforeEach(() => {
        page = new TodoPage();
    });

    it('should get and highlight Todos title attribute ', () => {
        page.navigateTo();
        expect(page.getTodoTitle()).toEqual('Todos');
    });

    it('should type something in filter category box and check that it returned correct element', () => {
        page.navigateTo();
        page.typeACategory('h');
        expect(page.getUniqueTodo('58af3a600343927e48e87217')).toEqual('Fry');
        page.backspace();
        page.typeACategory('s');
        expect(page.getUniqueTodo('58af3a600343927e48e87218')).toEqual('Workman');
    });

    it('should type something in filter by body box and check that it returned correct element', () => {
        page.navigateTo();
        page.typeABody('sunt tempor');
        expect(page.getUniqueTodo('58af3a600343927e48e872de')).toEqual('Blanche');
    });

    it('should type something in find todo by id and check that it returned correct element', () => {
        page.navigateTo();
        page.typeAId('58af3a600343927e48e872de');
        expect(page.getUniqueTodo('58af3a600343927e48e872de')).toEqual('Blanche');
    });

    // Need to add filtering by status when changed to select
    /*





     */

    it('Should open the expansion panel and get the owner', () => {
        page.navigateTo();
        page.getOwner('Dawn');
        browser.actions().sendKeys(Key.ENTER).perform();

        expect(page.getUniqueTodo('58af3a600343927e48e8721d')).toEqual('Dawn');

        // This is just to show that the panels can be opened
        browser.actions().sendKeys(Key.TAB).perform();
        browser.actions().sendKeys(Key.ENTER).perform();
    });

    it('Should allow us to filter todos based on owner', () => {
        page.navigateTo();
        page.getOwner('D');
        page.getTodos().then(function(todos) {
            expect(todos.length).toBe(50);
        });
        expect(page.getUniqueTodo('58af3a600343927e48e87229')).toEqual('Dawn');
        expect(page.getUniqueTodo('58af3a600343927e48e87232')).toEqual('Dawn');
        expect(page.getUniqueTodo('58af3a600343927e48e87254')).toEqual('Dawn');
        expect(page.getUniqueTodo('58af3a600343927e48e87278')).toEqual('Dawn');
    });

    it('Should allow us to clear a search for owner and then still successfully search again', () => {
        page.navigateTo();
        page.getOwner('Work');
        page.getTodos().then(function(todos) {
            expect(todos.length).toBe(49);
        });
        page.clickClearOwnerSearch();
        page.getTodos().then(function(todos) {
            expect(todos.length).toBeGreaterThan(100);
        });
        page.getOwner('Roberta');
        page.getTodos().then(function(todos) {
            expect(todos.length).toBe(46);
        });
    });

    it('Should allow us to search for owner, update that search string, and then still successfully search', () => {
        page.navigateTo();
        page.getOwner('B');
        page.getTodos().then(function(todos) {
            expect(todos.length).toBeGreaterThan(120);
        });


        element(by.id('todoOwner')).sendKeys('a');
        element(by.id('submit')).click();
        page.getTodos().then(function(todos) {
            expect(todos.length).toBe(51);
        });
    });

// For examples testing modal dialog related things, see:
// https://code.tutsplus.com/tutorials/getting-started-with-end-to-end-testing-in-angular-using-protractor--cms-29318
// https://github.com/blizzerand/angular-protractor-demo/tree/final

    it('Should have an add todo button', () => {
        page.navigateTo();
        expect(page.buttonExists()).toBeTruthy();
    });

    it('Should open a dialog box when add todo button is clicked', () => {
        page.navigateTo();
        expect(element(by.css('add-todo')).isPresent()).toBeFalsy('There should not be a modal window yet');
        element(by.id('addNewTodo')).click();
        expect(element(by.css('add-todo')).isPresent()).toBeTruthy('There should be a modal window now');
    });

    // Need to work on addTodoFunctionality first

    /*it('Should actually add the todo with the information we put in the fields', () => {
        page.navigateTo();
        page.clickAddTodoButton();
        element(by.id('nameField')).sendKeys('Tracy Kim');
        // Need to use backspace because the default value is -1. If that changes, this will change too.
        element(by.id('ageField')).sendKeys(protractor.Key.BACK_SPACE).then(function() {
            element(by.id('ageField')).sendKeys(protractor.Key.BACK_SPACE).then(function() {
                element(by.id('ageField')).sendKeys('26');
            });
        });
        element(by.id('companyField')).sendKeys('Awesome Startup, LLC');
        element(by.id('emailField')).sendKeys('tracy@awesome.com');
        element(by.id('confirmAddTodoButton')).click();
        // This annoying delay is necessary, otherwise it's possible that we execute the `expect`
        // line before the add todo has been fully processed and the new todo is available
        // in the list.
        setTimeout(() => {
            expect(page.getUniqueTodo('tracy@awesome.com')).toMatch('Tracy Kim.*'); // toEqual('Tracy Kim');
        }, 10000);
    });

    it('Should allow us to put information into the fields of the add todo dialog', () => {
        page.navigateTo();
        page.clickAddTodoButton();
        expect(element(by.id('nameField')).isPresent()).toBeTruthy('There should be a name field');
        element(by.id('nameField')).sendKeys('Dana Jones');
        expect(element(by.id('ageField')).isPresent()).toBeTruthy('There should be an age field');
        // Need to use backspace because the default value is -1. If that changes, this will change too.
        element(by.id('ageField')).sendKeys(protractor.Key.BACK_SPACE).then(function() {
            element(by.id('ageField')).sendKeys(protractor.Key.BACK_SPACE).then(function() {
                element(by.id('ageField')).sendKeys('24');
            });
        });
        expect(element(by.id('companyField')).isPresent()).toBeTruthy('There should be a company field');
        element(by.id('companyField')).sendKeys('Awesome Startup, LLC');
        expect(element(by.id('emailField')).isPresent()).toBeTruthy('There should be an email field');
        element(by.id('emailField')).sendKeys('dana@awesome.com');
        element(by.id('exitWithoutAddingButton')).click();
    });*/
});
