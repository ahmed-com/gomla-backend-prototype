const fs = require('fs')
const faker_en = require('faker/locale/en');
const faker_ar = require('faker/locale/ar');

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
        joinStatus: Math.floor(Math.random() * 7),
        joinDate: optional(faker.datatype.datetime())
    }
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

function generateRandomDeal() {
    const faker = getDataSource();

    return {
        id: faker.datatype.uuid(),
        title: faker.datatype.string(),
        subject: faker.datatype.string(),
        type:  faker.datatype.string(),
        location: faker.datatype.string(),
        expected_vendor: faker.datatype.string(),
        expected_price: faker.datatype.string(),
        currency: faker.datatype.string(),
        notice: optional(faker.datatype.string()),
        label: optional(faker.datatype.string()),
        rating: optional(faker.datatype.string()),
        tag: optional(faker.datatype.string()),
        createTime: optional(faker.datatype.datetime()),
        buyingDate: faker.datatype.datetime(),
    }
}

function generateSchema() {
    const profile = generateRandomUser();
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
    fs.writeFileSync('./db.json',jsonSchema);
}

