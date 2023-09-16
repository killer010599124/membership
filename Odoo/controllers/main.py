import base64
from collections import defaultdict

from odoo import http
from odoo.http import request, Response
import json
import xmlrpc.client

def contact_login(user_login, user_password):
    Contact = request.env['res.partner']
    contact = Contact.search([('user_login', '=', user_login)], limit=1)

    if contact:
        # Perform the login for the specified contact
        uid = request.session.authenticate(request.session.db, user_login, user_password)
        if uid:
            # Successfully logged in
            return "Login successful"
        else:
            # Failed to log in
            return "Login failed"
    else:
        # Contact not found
        return "Contact not found"
class APIController(http.Controller):
    @http.route('/get_session_id', type='http', auth='user')
    def get_session_id(self):
        # Define the server URL and database name
        server_url = 'https://localhost:8069'
        db_name = 'odoo'
        login = 'xyz@gmail.com'
        password = 'odoo'

        # Authenticate to the server and get the session ID
        common = xmlrpc.client.ServerProxy('{}/xmlrpc/2/common'.format(server_url))
        uid = common.authenticate(db_name, login, password, {})
        models = xmlrpc.client.ServerProxy('{}/xmlrpc/2/object'.format(server_url))
        session_id = models.execute_kw(db_name, uid, password, 'res.users', 'read', [uid], {'fields': ['session_id']})

        # Return the session ID as a response
        return session_id[0]['session_id']

    @http.route('/api/login/', type="http", auth="public", methods=['POST'], csrf=False)
    def login(self, **post):
        """Handle user login"""

        # Get user credentials from request parameters
        login = request.params.get('login')
        password = request.params.get('password')
        db = request.params.get('db')

        if not login or not password:
            return Response(response=json.dumps({'error': 'Please 3provide both email and password'}),
                            content_type='application/json', status=400)

        # Authenticate the user
        try:
            uid = request.session.authenticate(db, login, password)
        except Exception as e:
            return Response(response=json.dumps({'error': str(e)}),
                            content_type='application/json', status=400)

        if not uid:
            return Response(response=json.dumps({'error': 'Invalid credentials'}),
                            content_type='application/json', status=400)

        # Retrieve user data
        user = request.env['res.users'].sudo().browse(uid)
        response_data = {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'db' : db,
            # Add any other fields you want to include in the response
        }

        return Response(response=json.dumps(response_data), content_type='application/json')
    
    @http.route('/api/v1/products/', methods=["GET"], type='http', auth='public', csrf=False)
    def list_products(self, **post):

        name = post.get('name')
        name = name.lower()
        barcode = post.get('barcode')

        search_param = []
        if(name == ''):
            if barcode == '': search_param = [] 
            else: search_param = [('barcode', '=', barcode)]
        else:
            if barcode == '':
                search_param = [('name', 'ilike', '%' + name + '%')] 
            else: search_param = [('barcode', '=', barcode), ('name', 'ilike', '%' + name + '%')]
        # Fetch products data
        products = request.env['product.product'].search(search_param)
        
        # Return JSON response
        return Response(response=json.dumps([{
            'id': p['id'], 
            'name': p['name'],
            'barcode': p['barcode'],
            'list_price': p['list_price'],      #Sale Price#
            'color': p['color'],
            'default_code': p['default_code'],  #internal reference#
            'categories': [category.name for category in p.categ_id],
            'image_url': '/web/image/product.product/%s/image_1024' % p.id,
            'standard_price': p.standard_price
        } for p in products]), content_type='application/json')
    
    @http.route('/api/v1/products_field/', methods=["GET"], type='http', auth='public', csrf=False)
    def field_products(self):
        return Response(response=json.dumps("This is API apply."), content_type='application/json')
    
    @http.route('/api/product/', auth='public', type='http', methods=['POST'], csrf=False)
    def get_product_data(self, **kw):
        product_id = request.params.get('product_id')
        product_id = int(product_id)  # Convert the parameter to an integer
        product = http.request.env['product.product'].browse(product_id)
        response_data = {
            'name': product.name,
            'description': product.description_sale,
            'list_price': product.list_price,
            'categories': [category.name for category in product.categ_id],
            'color': product.color,
            'default_code': product.default_code,  #internal reference#
            'image_url': '/web/image/product.product/%s/image_1024' % product.id,
            'standard_price': product.standard_price
            # Add additional fields as needed
        }
        return json.dumps(response_data)
    
    @http.route('/api/product/create/', auth='public', type='http', methods=['POST'], csrf=False)
    def create_product(self, **post):

        data = json.loads(request.httprequest.data)
        data['list_price'] = round(float(data['list_price']), 3)
        data['standard_price'] = round(float(data['standard_price']), 3)
        try:
            new_product = http.request.env['product.product'].create(data)
        except Exception as e:
            return Response(response=json.dumps({'error': str(e)}),
                            content_type='application/json', status=400)

        
        return json.dumps({
            'id': new_product.id,
            'name': new_product.name,
            # 'description': new_product.description_sale,
            'list_price': new_product.list_price,
            'default_code': new_product.default_code,
            'barcode': new_product.barcode,
            'categories': [category.name for category in new_product.categ_id],
            'image_url': '/web/image/product.product/%s/image_1024' % new_product.id,
            'standard_price': new_product.standard_price,
            # Add additional fields as needed
        })

    @http.route('/api/delete/product', auth='public', type='http', methods=['POST'], csrf=False)
    def delete_product(self, **kw):
        product_id = request.params.get('product_id')
        product_id = int(product_id)  # Convert the parameter to an integer

        Product = request.env['product.product']
        product = Product.browse(product_id)

        product.unlink()

        return Response('Product(s) successfully deleted.', status=200)

    @http.route('/api/update/product', type='http', auth='public', methods=['POST'], csrf=False)
    def update_product(self, **kw):
    
        data = json.loads(request.httprequest.data)


        product_id = data['product_id']
        product_id = int(product_id)  # Convert the parameter to an integer
        
        name = data['name']
        list_price = round(float(data['list_price']), 3)
        standard_price = round(float(data['standard_price']), 3)
        barcode = data['barcode']
        default_code = data['default_code']

        json_product = {
            'name': name,
            'list_price': list_price,
            'standard_price': standard_price,
            'barcode': barcode,
            'default_code': default_code
        }
        
        try:
            product = http.request.env['product.product'].browse(product_id)

            if(product.barcode == barcode):
                json_product = {
                    'name': name,
                    # 'description_sale': description_sale,
                    'list_price': list_price,
                    'standard_price': standard_price,
                    'default_code': default_code
                }

            product.write(json_product)
        except Exception as e:
            return Response(response=json.dumps({'error': str(e)}),
                            content_type='application/json', status=400)
        
        return json.dumps(json_product)

    @http.route('/api/v1/test/', methods=["GET"], type='http', auth='public', csrf=False)
    def field_products1(self):
        return Response(response=json.dumps("This is test API apply."), content_type='application/json')
    
    @http.route('/api/create_contact', auth='public', type='http', website=True, methods=['POST'], csrf=False)
    def create_contact(self, **post):
        env = request.env
        contact_vals = {
            'name': post.get('name'),
            'email': post.get('email'),
            'phone': post.get('phone'),
            # Add other contact fields as needed
        }
        password = post.get('password')
        image = post.get('image')

        if image:
            contact_vals['image'] = base64.b64encode(image.read())

        user_vals = {
            'name': post.get('name'),
            'login': post.get('email'),
            'password': password,
            # Add other user fields as needed
        }

        contact = env['res.partner'].sudo().create(contact_vals)
        user = env['res.users'].sudo().create(user_vals)
        contact.user_id = user

        return 'Contact created with ID: {}'.format(contact.id)
    


    @http.route('/api/pos-barcode/', auth='public', type='http', website=True, methods=['POST'],csrf=False)
    def get_pos_barcode_route(self, **post):

        email = post.get('email')
        contacts = request.env['res.partner'].search([('email', '=', email)])
        
        return contacts[0].barcode
    
    @http.route('/api/contact-info/', auth='public', type='http', website=True, methods=['POST'],csrf=False)
    def get_contact_info_route(self, **post):

        email = post.get('email')
        contacts = request.env['res.partner'].search([('email', '=', email)])
        contact = contacts[0]
        properties = {}
        for field_name in contact.fields_get():
            value = contact[field_name]
            properties[field_name] = value

        return str(properties)
    
    @http.route('/api/get_contact_total_sales', auth='public', type='http', website=True, methods=['POST'],csrf=False)
    def get_contact_total_sales(self, **post):
        # Retrieve the contact
        email = post.get('email')
        contacts = request.env['res.partner'].search([('email', '=', email)])
        contact = contacts[0]

        # Retrieve total sales price associated with the contact
        total_sales_price = contact.sale_order_ids.mapped('amount_total')

        # Calculate the sum of the sales prices
        total_sales_price = sum(total_sales_price)

        # Return the total sales price
        return str(total_sales_price)
    
    @http.route('/api/get_contact_loyalty_points', auth='public', type='http', website=True, methods=['POST'],csrf=False)
    def get_contact_loyalty_points(self, **post):
        # Retrieve the contact
        email = post.get('email')
        contacts = request.env['res.partner'].search([('email', '=', email)])
        contact = contacts[0]

        return "hello"
    
    @http.route('/api/get_contact_eWallet_balance', auth='public', type='http', website=True, methods=['POST'],csrf=False)
    def get_contact_eWallet_balance(self, **post):
        # Retrieve the contact
        email = post.get('email')
        contacts = request.env['res.partner'].search([('email', '=', email)])
        contact = contacts[0]

        payment = http.request.env['account.payment'].sudo().search([('partner_id', '=', contact.id)], limit=1)
        
        return str(payment)
        e_wallet_balance = payment.e_wallet_balance if payment else 0.0

    @http.route('/api/get_contact_giftcards', auth='public', type='http', website=True, methods=['POST'],csrf=False)
    def get_giftcard(self,  **post):
        email = post.get('email')
        contacts = request.env['res.partner'].search([('email', '=', email)])
        contact = contacts[0]

        giftcards = request.env['loyalty.card'].search([('partner_id', '=', contact.id)])
        gift_data = [{
            'name': gift.name,

        } for gift in giftcards]
        return str(giftcards)
        
    
    @http.route('/api/get_contact_orders', auth='public', type='http', website=True, methods=['POST'],csrf=False)
    def get_pos_orders(self,  **post):
        email = post.get('email')
        contacts = request.env['res.partner'].search([('email', '=', email)])
        contact = contacts[0]

        orders = request.env['pos.order'].search([('partner_id', '=', contact.id)])
        order_data = [{
            'name': order.name,
            'date_order': order.date_order,
            'amount_total': order.amount_total,
        } for order in orders]
        return str(order_data)
        
def get_pos_barcode(contact_id):
    contact = request.env['res.partner'].browse(int(contact_id))

    properties = {}
    for field_name in contact.fields_get():
        value = contact[field_name]
        properties[field_name] = value

    return str(properties)
