(function () {
  const expressionPattern = /\{\{\s*([\s\S]*?)\s*\}\}/g;

  function evaluate(expression, scope) {
    try {
      return Function("scope", `with (scope) { return (${expression}); }`)(scope);
    } catch (error) {
      console.error("Template expression failed:", expression, error);
      return undefined;
    }
  }

  function unwrapExpression(value) {
    const match = /^\s*\{\{\s*([^{}]*?)\s*\}\}\s*$/.exec(value || "");
    return match ? match[1] : null;
  }

  function interpolate(value, scope) {
    const direct = unwrapExpression(value);
    if (direct) return evaluate(direct, scope);
    return String(value || "").replace(expressionPattern, (_, expression) => {
      const result = evaluate(expression, scope);
      return result == null ? "" : String(result);
    });
  }

  function processNode(node, scope) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.data.includes("{{")) node.data = interpolate(node.data, scope);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const tag = node.tagName.toLowerCase();
    const isIf = tag === "sc-if" || (tag === "template" && node.hasAttribute("data-sc-if"));
    const isFor = tag === "sc-for" || (tag === "template" && node.hasAttribute("data-sc-for"));
    if (isIf) {
      const condition = interpolate(node.getAttribute("value"), scope);
      if (!condition) {
        node.remove();
        return;
      }
      const source = tag === "template" && node.content ? node.content : node;
      const children = [...source.childNodes];
      children.forEach(child => {
        node.parentNode.insertBefore(child, node);
        processNode(child, scope);
      });
      node.remove();
      return;
    }

    if (isFor) {
      const list = interpolate(node.getAttribute("list"), scope) || [];
      const alias = node.getAttribute("as") || "item";
      const source = tag === "template" && node.content ? node.content : node;
      const template = [...source.childNodes].map(child => child.cloneNode(true));
      for (const item of list) {
        const childScope = Object.create(scope);
        childScope[alias] = item;
        for (const source of template) {
          const clone = source.cloneNode(true);
          node.parentNode.insertBefore(clone, node);
          processNode(clone, childScope);
        }
      }
      node.remove();
      return;
    }

    const deferredProperties = [];
    for (const attribute of [...node.attributes]) {
      if (attribute.name.startsWith("hint-")) {
        node.removeAttribute(attribute.name);
        continue;
      }
      if (!attribute.value.includes("{{")) continue;
      const result = interpolate(attribute.value, scope);
      const lowerName = attribute.name.toLowerCase();
      if (lowerName.startsWith("on") && typeof result === "function") {
        node.removeAttribute(attribute.name);
        node.addEventListener(lowerName.slice(2), result);
      } else if (lowerName === "value") {
        node.setAttribute(attribute.name, result == null ? "" : String(result));
        deferredProperties.push(["value", result == null ? "" : result]);
      } else if (result === false || result == null) {
        node.removeAttribute(attribute.name);
      } else {
        node.setAttribute(attribute.name, String(result));
      }
    }

    [...node.childNodes].forEach(child => processNode(child, scope));
    deferredProperties.forEach(([name, value]) => { node[name] = value; });
  }

  class DCLogic {
    setState(patch) {
      this.state = { ...this.state, ...patch };
      this.__render?.();
    }
  }

  window.DCLogic = DCLogic;

  window.addEventListener("DOMContentLoaded", async () => {
    const responsiveStyle = document.createElement("style");
    responsiveStyle.textContent = `
      @media (max-width: 760px) {
        x-dc > div > header { padding: 0 12px !important; gap: 10px !important; }
        x-dc > div > header > div:first-child { min-width: 0 !important; }
        x-dc > div > header > div:first-child small,
        x-dc > div > header > div:nth-child(2) { display: none !important; }
        x-dc > div > div { display: block !important; }
        x-dc aside { display: none !important; }
        x-dc main { width: 100% !important; min-width: 0 !important; padding: 16px 12px 48px !important; }
        x-dc main * { max-width: 100%; }
        x-dc main [style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
        x-dc main article { min-width: 0 !important; width: auto !important; }
        x-dc main [style*="display:flex"] { flex-wrap: wrap; }
        x-dc main [style*="min-width"] { min-width: 0 !important; }
        x-dc main table { min-width: 720px; }
        x-dc main [style*="overflow-x:auto"] { width: 100% !important; max-width: 100%; }
        x-dc main section[data-jump] { scroll-margin-top: 64px; }
      }
    `;
    document.head.appendChild(responsiveStyle);
    const root = document.querySelector("x-dc");
    const logicScript = document.querySelector('script[type="text/x-dc"][data-dc-script]');
    if (!root || !logicScript) return;

    let rawTemplate = root.innerHTML;
    try {
      const sourceResponse = await fetch(window.location.href, { cache: "no-store" });
      const sourceText = await sourceResponse.text();
      rawTemplate = sourceText.match(/<x-dc>([\s\S]*?)<\/x-dc>/i)?.[1] || rawTemplate;
    } catch (error) {
      console.warn("Falling back to parsed design template", error);
    }
    const templateSource = rawTemplate
      .replace(/<sc-(if|for)\b/gi, "<template data-sc-$1")
      .replace(/<\/sc-(if|for)>/gi, "</template>");
    let ComponentClass;
    try {
      ComponentClass = Function("DCLogic", `${logicScript.textContent}\nreturn Component;`)(DCLogic);
    } catch (error) {
      console.error("Failed to initialize design logic", error);
      return;
    }

    const component = new ComponentClass();
    component.__render = () => {
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      const values = component.renderVals();
      const scope = Object.assign(Object.create(null), values);
      const template = document.createElement("template");
      template.innerHTML = templateSource;
      [...template.content.childNodes].forEach(child => processNode(child, scope));
      root.replaceChildren(template.content);
      requestAnimationFrame(() => window.scrollTo(scrollX, scrollY));
    };
    component.__render();
    window.__dcComponent = component;
  });
})();
