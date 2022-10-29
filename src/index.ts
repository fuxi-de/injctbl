import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";

console.log("loading injctbl ... |==|iiii|>----- ");

const editableElements = [
  ...document.querySelectorAll<HTMLElement>(".injctbl-target"),
];

console.log(`found ${editableElements.length} Elements to inject editor.`);

const addInjectionEventListener = (element: HTMLElement) =>
  element.addEventListener("click", targetClickHandler, { once: true });

const injectEditor = (element: HTMLElement) => {
  console.log("current elements content is:", element.innerHTML);
  const tipTap = new Editor({
    element,
    extensions: [StarterKit],
    content: element.innerHTML,
  });
  element.removeEventListener("click", targetClickHandler);
  document.addEventListener("click", some_function(element, tipTap));
};

const targetClickHandler = (event: MouseEvent) => {
  console.log("element clicked");
  const targetElement = event.target as HTMLElement;
  const injectionTarget = targetElement.classList.contains("injctbl-target")
    ? targetElement
    : targetElement.closest<HTMLElement>(".injctbl-target");
  if (injectionTarget) injectEditor(injectionTarget);
};

//TODO move to init function
editableElements.forEach((element) => addInjectionEventListener(element));

//curried event listener to enable var passing
const some_function = function (someVar: any, editor: any) {
  return function curried_func(e: MouseEvent) {
    console.log("observed element is: ", someVar);
    const isClickInside = someVar.contains(e.target);
    if (!isClickInside) {
      console.log("clicked outside ", someVar);
      someVar.innerHTML = editor.getHTML();
      editor.destroy();
      addInjectionEventListener(someVar);
      document.removeEventListener("click", curried_func);
    }
  };
};
