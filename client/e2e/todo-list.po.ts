import {browser, element, by, promise, ElementFinder} from 'protractor';
import {Key} from 'selenium-webdriver';

export class TodoPage {
    navigateTo(): promise.Promise<any> {
        return browser.get('/todos');
    }

    // http://www.assertselenium.com/protractor/highlight-elements-during-your-protractor-test-run/
    highlightElement(byObject) {
        function setStyle(element, style) {
            const previous = element.getAttribute('style');
            element.setAttribute('style', style);
            setTimeout(() => {
                element.setAttribute('style', previous);
            }, 200);
            return 'highlighted';
        }

        return browser.executeScript(setStyle, element(byObject).getWebElement(), 'color: red; background-color: yellow;');
    }

    getTodoTitle() {
        const title = element(by.id('todo-list-title')).getText();
        this.highlightElement(by.id('todo-list-title'));

        return title;
    }

    typeACategory(category: string) {
        const input = element(by.id('todoCategory'));
        input.click();
        input.sendKeys(category);
    }

    clickAllButton() {
        const input = element(by.id('allButton'));
        input.click();
    }

    clickCompleteButton() {
        const input = element(by.id('trueButton'));
        input.click();
    }

    clickIncompleteButton() {
        const input = element(by.id('falseButton'));
        input.click();
    }


    typeAId(Id: string) {
        const input = element(by.id('todoId'));
        input.click();
        input.sendKeys(Id);
    }

    selectUpKey() {
        browser.actions().sendKeys(Key.ARROW_UP).perform();
    }

    backspace() {
        browser.actions().sendKeys(Key.BACK_SPACE).perform();
    }

    getOwner(owner: string) {
        const input = element(by.id('todoOwner'));
        input.click();
        input.sendKeys(owner);
        const selectButton = element(by.id('submit'));
        selectButton.click();
    }

    typeABody(body: string) {
        const input = element(by.id('todoBody'));
        input.click();
        input.sendKeys(body);
    }

    getUniqueTodo(Id: string) {
        const todo = element(by.id(Id)).getText();
        this.highlightElement(by.id(Id));

        return todo;
    }

    getUniqueOwner(owner: string) {
        const todo = element(by.id(owner)).getText();
        this.highlightElement(by.id(owner));

        return todo;
    }

    getTodos() {
        return element.all(by.className('todos'));
    }

    clickClearOwnerSearch() {
        const input = element(by.id('ownerClearSearch'));
        input.click();
    }

    buttonExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('addNewTodo'));
        return element(by.id('addNewTodo')).isPresent();
    }

    clickAddTodoButton(): promise.Promise<void> {
        this.highlightElement(by.id('addNewTodo'));
        return element(by.id('addNewTodo')).click();
    }

}
