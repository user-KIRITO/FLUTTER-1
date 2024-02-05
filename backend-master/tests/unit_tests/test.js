const chai = require('chai');
const chaiHttp = require('chai-http')
const app = require('../../server'); // Import the server app here
const should = chai.should();

chai.use(chaiHttp);

describe('UNIT TESTING ECOM_API', () => {
  // Test the root endpoint
  it(' message on GET /api/', (done) => {
    chai.request(app)
      .get('/api')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('This is ecom backend');
        done();
      });
  });
  
  it(' message on GET /api/viewAllProducts', (done) => {
    chai.request(app)
      .get('/api/viewAllProducts')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();
      });
  });

  it('should create product on POST /addProduct', (done) => {
    const dataToCreate = {
        productName: 'test1',
        qty: 1,
        price: 1.99,
        category: 'test-cat',
        description: 'test-desc',
        images: [], // imageArray is null when product is first created. Then uses addImage to Add URLs
        urlKey: 'test-url-key',
        metaTitle: 'test-title-meta',
        metaKeyWords: 'test-meta-key-words',
        metaDescription: 'test-meta-desc',
        status: true,
        visibility: false,
        stockAvailable: true,
    };
  
    chai.request(app)
      .post('/api/addProduct')
      .send(dataToCreate) // Send the data in the request body
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });

  it('should update product on POST /updateProduct', (done) => {
    const dataToCreate = {
        productName: 'test1-update',
        qty: 5,
        price: 3.99,
        urlKey: 'test-url-key',
      
    };
  
    chai.request(app)
      .post('/api/updateProduct')
      .send(dataToCreate) // Send the data in the request body
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });

  
  it('should delete product on POST /deleteProduct', (done) => {
    const dataToCreate = {
        id : 'tes_id',
    };
  
    chai.request(app)
      .post('/api/deleteProduct')
      .send(dataToCreate) // Send the data in the request body
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });


});
