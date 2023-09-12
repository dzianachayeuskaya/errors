const container = document.createElement('div');
const infoBlocks = document.createElement('div');

container.classList.add('container');
infoBlocks.style.position = 'absolute';
infoBlocks.style.bottom = '1rem';
infoBlocks.style.right = '1rem';


container.innerHTML = '';

function createLoader() {
  const wrapper = document.createElement('div');
  const spinner = document.createElement('div');
  const span = document.createElement('span');

  wrapper.classList.add('d-flex', 'justify-content-center');
  wrapper.style.marginTop = '2rem';
  spinner.classList.add('spinner-border');
  spinner.style.width = '3rem';
  spinner.style.height = '3rem';
  spinner.getAttribute('role', 'status');
  span.classList.add('visually-hidden');

  span.textContent = 'Загрузка...';

  spinner.append(span);
  wrapper.append(spinner);
  return wrapper
}

container.append(createLoader());
document.body.append(container);
document.body.append(infoBlocks);

(async () => {
  let errors = [];

  function loadData() {
    return fetch(`/api/products`)
      .then((response) => {
        console.log(response);
        switch (response.status) {
          case 404: errors.push({ name: 'Error 404', message: 'Список товаров пуст' });
            break;
          case 500: errors.push({ name: 'Error 500', message: 'Произошла ошибка, попробуйте обновить страницу позже' });
            break;
        }
        return response.json()
      })
      .then((data) => {
        console.log(data);
        return data
      })
      .catch((error) => {
        console.log(error)
        errors.push({ name: error.name, message: error.message });
      });
  }
  let data = await loadData();

  function createProductsList(productsData) {
    container.innerHTML = '';
    const productsList = document.createElement('div');

    productsList.style.display = 'grid';
    productsList.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
    productsList.style.gap = '1rem';

    productsData.products.forEach(product => {
      const card = document.createElement("div");
      const img = document.createElement("img");
      const descr = document.createElement("div");
      const title = document.createElement("h5");
      const price = document.createElement("p");

      card.classList.add("card");
      img.classList.add("card-img-top");
      descr.classList.add("card-body");
      title.classList.add("card-title");
      price.classList.add("card-text");

      img.src = product.image;
      title.textContent = product.name;
      price.textContent = product.price;

      descr.append(title);
      descr.append(price);
      card.append(img);
      card.append(descr);

      productsList.append(card);
      container.append(productsList);
    });
  }

  console.log(errors)
  let reloadNumber = 0;

  async function checkErrors() {

    async function check500Error() {
      reloadNumber += 1;
      console.log(reloadNumber);
      if (reloadNumber === 3) {
        infoBlocks.append(createErrorBlock('Произошла ошибка, попробуйте обновить страницу позже'));
        return
      }
      errors = [];
      data = await loadData();
      await checkErrors();
    }

    if (errors.length === 0) {
      createProductsList(data);
    } else {
      for (let i = 0; i < errors.length; i++) {
        switch (errors[i].name) {
          case 'Error 404': container.innerHTML = '<h2>Список товаров пуст </h2>';
            break;
          case 'Error 500': await check500Error();
            break;
          case 'SyntaxError': infoBlocks.append(createErrorBlock('Произошла ошибка, попробуйте обновить страницу позже'));
            break;
          case 'TypeError': infoBlocks.append(createErrorBlock('Произошла ошибка, проверьте подключение к интернету'));
            break;
        }
      }
    }
  }

  await checkErrors();

  window.addEventListener("offline", () => {
    console.log('offline');
    infoBlocks.append(createInfoBlock('Произошла ошибка, проверьте подключение к интернету'));
  });

  window.addEventListener("online", async () => {
    console.log('online')
    infoBlocks.append(createInfoBlock('Соединение восстановлено'));
    // reload App
    for (const error of errors) {
      if (error.name === 'TypeError') {
        reloadNumber = 0;
        errors = [];
        data = await loadData();
        await checkErrors();
      }
    }
  });

  function createInfoBlock(message) {
    const infoBlock = document.createElement('div');
    infoBlock.style.padding = '1rem';
    infoBlock.style.border = '2px red solid';
    infoBlock.textContent = message;
    setTimeout(() => infoBlock.remove(), 3000);

    return infoBlock
  }


  function createErrorBlock(message) {
    container.innerHTML = '';
    const errorBlock = createInfoBlock(message);
    return errorBlock
  }
})()
