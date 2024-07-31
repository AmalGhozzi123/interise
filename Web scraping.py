from bs4 import BeautifulSoup
import requests
import pymongo
import time
from urllib.parse import urlparse
from datetime import datetime
from urllib.parse import urljoin

try:
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client["pfe"]
    collection = db["products"] 
    print("Connexion à la base de données MongoDB réussie.")
except pymongo.errors.ConnectionFailure as e:
    print(f"Erreur lors de la connexion à MongoDB : {e}")
    exit()


def get_category_info(menu_url):
    print("Récupération des informations de catégorie...")
    category_info = []

    try:
        response = requests.get(menu_url)
        response.raise_for_status()  

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            category_elements = soup.select('li.level-1.parent')

            for idx, category_element in enumerate(category_elements, start=1):
                category_name = category_element.select_one('div.icon-drop-mobile span').text.strip()
                category_url = category_element.select_one('div.icon-drop-mobile + div.wb-sub-menu').find('a')['href']

                if category_name.lower() != "accueil":
                    subcategories_info = []
                    subcategories_elements = category_element.select('ul.ul-column a')

                    for subcategory_element in subcategories_elements:
                        subcategory_name = subcategory_element.text.strip()
                        subcategory_url = subcategory_element['href']

                        subcategories_info.append({
                            'Nom de la sous-catégorie': subcategory_name,
                            'URL de la sous-catégorie': subcategory_url,
                        })

                    category_info.append({
                        'Nom de la catégorie': category_name,
                        'URL de la catégorie': category_url,
                        'Sous-catégories': subcategories_info
                    })

            print("Informations de catégorie récupérées avec succès.")
        else:
            print(f"Erreur HTTP {response.status_code} lors de la récupération du menu.")
    except requests.exceptions.RequestException as e:
        print(f"Erreur lors de la récupération des informations de catégorie : {e}")

    return category_info


def get_category_urls(category_info):
    category_urls = []

    for info in category_info:
        category_urls.append(info['URL de la catégorie'])

        for subcategory_info in info.get('Sous-catégories', []):
            category_urls.append(subcategory_info['URL de la sous-catégorie'])

    return category_urls

def scrape_category_products(category_url, processed_urls):
    print(f"Récupération des produits de la catégorie: {category_url}")
    all_products_list = []

    page_number = 1
    while True:
        url = f"{category_url}?page={page_number}"
        category_products = scrape_products(url, processed_urls)

        if not category_products:
            break  
        
        all_products_list.extend(category_products)

        print(f"Résultats de la page {page_number} de la catégorie {category_url}: {len(category_products)} produits")
        for product in category_products:
            print("Informations du produit:")
            for key, value in product.items():
                print(f"{key}: {value}")
            print("---------------------------------- ")

        page_number += 1
        time.sleep(5)

    return all_products_list
def scrape_products(url, processed_urls):
    results = []

    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        products = soup.find_all('div', class_='thumbnail-container text-xs-center')

        breadcrumbs = soup.find('ol', {'itemtype': 'http://schema.org/BreadcrumbList'})
        categories = breadcrumbs.find_all('span', itemprop='name')

        category = "Non spécifié"
        subcategory = "Non spécifié"
        subsubcategory = ""
        for idx, cat in enumerate(categories):
            if idx == 1:
                category = cat.text.strip()
            elif idx == 2:
                subcategory = cat.text.strip()
            elif idx == 3:
                subsubcategory = cat.text.strip()  

        for product in products:
            name = product.find('h2', class_='h3 product-title').text.strip()
            price = product.find('span', class_='price').text.strip()
            in_stock_element = product.find('span', class_='in-stock')
            later_stock_element = product.find('span', class_='later-stock')            

            if in_stock_element:
                availability = in_stock_element.text.strip()
            elif later_stock_element:
                availability = later_stock_element.text.strip()
            else:
                availability = "Non spécifié"

            image = product.find('img', class_='center-block img-responsive')['src'] if product.find('img', class_='center-block img-responsive') else "Aucune image disponible"
            reference_element = product.find('span', class_='product-reference')
            reference = reference_element.text.strip('[]') if reference_element else "Non spécifié"
            brand_element = product.find('img', class_='img img-thumbnail manufacturer-logo')
            brand = brand_element['alt'] if brand_element else "Not specified"
            brand_image = brand_element['src'] if brand_element else "Not specified"
            product_url = product.find('a')['href'] if product.find('a') else "URL non disponible"
            base_url = 'https://www.tunisianet.com.tn'

            company_logo_path = soup.find('img', class_='logo img-responsive')['src'] if soup.find('img', class_='logo img-responsive') else ""
            company_logo_url = urljoin(base_url, company_logo_path)  
            company_name = scrape_product_company(product_url)
            description_element = product.find('div', itemprop='description')
            description = description_element.text.strip() if description_element else "Description non disponible"

            discount_element = product.find('span', class_='discount-amount')
            discount_amount = discount_element.text.strip() if discount_element else "Aucune remise"
            if product_url not in processed_urls:
                processed_urls.add(product_url)  
                product_info = {
                    "Ref": reference,
                    "Designation": name,
                    "Price": price,
                    "Stock": availability,
                    "Image": image,
                    "Brand": brand,
                    "Company": company_name,  
                    "CompanyLogo": company_logo_url,
                    "Link": product_url,
                    "Description": description,
                    "DiscountAmount": discount_amount,
                    "BrandImage": brand_image, 
                    "Category": category,
                    "Subcategory": subcategory,
                }
                results.append(product_info)

    except requests.exceptions.RequestException as e:
        print(f"Erreur lors de la récupération des produits à partir de l'URL {url}: {e}")

    return results
def scrape_product_company(menu_url):
    try:
        domain = urlparse(menu_url).hostname
        if domain:
            company_name = domain.split('.')[1].capitalize()  
            return company_name
        else:
            return "Unknown Company"
    except Exception as e:
        print(f"Erreur lors de la récupération du nom de la société à partir de l'URL {menu_url}: {e}")
        return "Unknown Company"

def compare_and_store_new_products(all_products_list):
    previous_products = list(collection.find({"Company": "Tunisianet"})) 
    new_products = []
    updated_products = []
    deleted_product_ids = set()

    current_products_dict = {(product["Ref"], product["Designation"]): product for product in all_products_list}

    for prev_product in previous_products:
        prev_ref_desig = (prev_product["Ref"], prev_product["Designation"])
        if prev_ref_desig not in current_products_dict:
            collection.update_one({"_id": prev_product["_id"]}, {"$set": {"Stock": "Hors stock"}})
            deleted_product_ids.add(prev_product["Ref"])
            print(f"Produit {prev_product['Ref']} marqué comme 'Hors stock' dans la base de données.")

    for product in all_products_list:
        existing_product = collection.find_one({"Ref": product["Ref"], "Company": "Tunisianet"})
        if existing_product:
            if existing_product["Designation"] == product["Designation"]:
                updates = {}
                modifications = existing_product.get("Modifications", [])
                if existing_product.get("Price") != product["Price"]:
                    modification_record = {
                        "dateModification": datetime.now(),
                        "ancienPrix": existing_product["Price"],
                        "nouveauPrix": product["Price"]
                    }
                    modifications.append(modification_record)
                    updates["Price"] = product["Price"]
                    updates["Modifications"] = modifications

                if updates:
                    collection.update_one({"Ref": product["Ref"], "Designation": product["Designation"]}, {"$set": updates})
                    updated_products.append(product["Ref"])
                    print(f"Produit {product['Ref']} mis à jour avec les modifications de prix dans la base de données.")

                if existing_product["Stock"] != product["Stock"]:
                    collection.update_one({"Ref": product["Ref"], "Designation": product["Designation"]}, {"$set": {"Stock": product["Stock"]}})
                    print(f"État du stock du produit {product['Ref']} mis à jour dans la base de données.")

                if existing_product.get("DiscountAmount") != product.get("DiscountAmount"):
                    collection.update_one({"Ref": product["Ref"], "Designation": product["Designation"]}, {"$set": {"DiscountAmount": product["DiscountAmount"]}})
                    print(f"État de la remise du produit {product['Ref']} mis à jour dans la base de données.")
                if existing_product.get("Image") != product.get("Image"):
                    collection.update_one({"Ref": product["Ref"], "Designation": product["Designation"]}, {"$set": {"Image": product["Image"]}})
                    print(f"Nouvelle image du produit {product['Ref']} stockée dans la base de données.")
            else:
                new_products.append(product)
        else:
            product[""] = datetime.DateAjoutnow()
            new_products.append(product)

    if new_products:
        collection.insert_many(new_products)

    print(f"{len(new_products)} nouveaux produits ajoutés à la base de données.")
    print(f"{len(deleted_product_ids)} produits marqués comme supprimés et hors stock.")
    print(f"{len(updated_products)} produits mis à jour dans la base de données.")

def run_scraping():
    print("Début du scraping...")
    menu_url = 'https://www.tunisianet.com.tn/'

    category_info = get_category_info(menu_url)
    all_products_list = []
    processed_urls = set()

    for category_url in get_category_urls(category_info):
        category_products = scrape_category_products(category_url, processed_urls)
        all_products_list.extend(category_products)

    compare_and_store_new_products(all_products_list)

    print(f"Tous les résultats enregistrés dans la base de données MongoDB.")
    print(f"Nombre total de produits extraits: {len(all_products_list)}")

def main():
    try:
        run_scraping()
    except Exception as e:
        print(f"Une erreur s'est produite : {e}")
    finally:
        
        time.sleep(5)  

if __name__ == "__main__":
    main()
