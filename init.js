const fs = require('fs')
const faker_en = require('faker/locale/en');
const faker_ar = require('faker/locale/ar');
const currencies = Object.keys(require("./currencies.json"));

(function main() {
    const schema = generateSchema();
    storeSchema(schema);
})()

function getDataSource() {
    const coinFlip = Math.round(Math.random())
    return coinFlip ? faker_en : faker_ar;
}

function optional(data) {
    const coinFlip = Math.round(Math.random())
    if(coinFlip) return data;
}

function generateRandomUser() {
    const faker = getDataSource();

    return {
        id : faker.datatype.uuid(),
        name : faker.name.findName(),
        email : faker.internet.email(),
        password : faker.internet.password(),
        zipCode : faker.address.zipCode(),
        joinStatus: Math.floor(Math.random() * 5),
        joinDate: optional(faker.datatype.datetime()),
        avatar: optional(getRandomAvatar())
    }
}

function imageSources() {
    const imgs = [];
    for (let n = 1; n < 10; n++) {
        imgs.push(
            `https://picsum.photos/500/300?image=${n * 5 + 10}`
        );
    }
    return imgs;
}

function getRandomAvatar() {
    // const name = getDataSource().name.findName();
    // return `https://avatars.dicebear.com/api/initials/${name}.svg?background=%23005f6a`;
    const randNum = Math.ceil(Math.random() * 5);
    return `https://cdn.vuetifyjs.com/images/lists/${randNum}.jpg`
}

function getRandomCurrency() {
    const index = Math.floor(Math.random() * currencies.length)
    return currencies[index];
}

function getRandomElements(arr) {
    const elements_length = Math.floor(Math.random() * arr.length);
    const elements = [];
    const usedIndexes = new Set();

    for (let i = 0; i < elements_length; i++) {
        let index;

        do{
            index = Math.floor(Math.random() * arr.length);
        }while(usedIndexes.has(index));

        elements.push(arr[index]);

        usedIndexes.add(index);
    }
    return elements;
}

function getProfile() {
    const faker = getDataSource();
    
    return {
        name: 'ahmed grwa',
        email: 'test@test.test',
        password: '123654789',
        id: 3,
        zipCode : faker.address.zipCode(),
        joinStatus: Math.floor(Math.random() * 5),
        joinDate: optional(faker.datatype.datetime()),
        avatar: optional(getRandomAvatar())
    }
}

function generateRandomDeal() {
    const faker = getDataSource();

    return {
        id: faker.datatype.uuid(),
        title: faker.datatype.string(),
        description: faker.datatype.string(),
        type:  faker.datatype.string(),
        location: {
            lat: faker.datatype.number({min:30, max: 32}),
            lng: faker.datatype.number({min:30, max: 32}),
        },
        imgs: getRandomElements(imageSources()),
        expected_vendor: faker.datatype.string(),
        expected_price: faker.datatype.number(10000),
        currency: getRandomCurrency(),
        notice: optional(faker.datatype.string()),
        label: optional(faker.datatype.string()),
        rating: optional(faker.datatype.string()),
        tag: optional(faker.datatype.string()),
        createTime: optional(faker.datatype.datetime()),
        buyingDate: faker.datatype.datetime(),
    }
}

function generateSchema() {
    const profile = getProfile();
    const users = [];
    const partners = [];
    const deals = [];

    const deals_copy = [];
    const partners_copy = [];

    for (let i = 0; i < 12; i++) {
        users.push(generateRandomUser());

        const partner = generateRandomUser();
        const deal = generateRandomDeal();

        const partner_copy = Object.assign({},partner);
        const deal_copy = Object.assign({},deal);

        partners.push(partner);
        deals.push(deal);
        
        partners_copy.push(partner_copy);
        deals_copy.push(deal_copy);
    }

    for (let i = 0; i < 12; i++) {
        deals[i].partners = getRandomElements(partners_copy);
        deals[i].partners.push(profile);
        const coinFlip = Math.round(Math.random());
        deals[i].owner = coinFlip ? profile : generateRandomUser();
        partners[i].deals = getRandomElements(deals_copy);
    }

    return {
        profile,
        users,
        partners,
        deals
    }
}

function storeSchema(schema) {
    const jsonSchema = JSON.stringify(schema)
    fs.writeFileSync('./data/db.json',jsonSchema);
}

