import { z } from "zod";

export type FieldType = 
  | 'text' 
  | 'textarea' 
  | 'number' 
  | 'select' 
  | 'image' 
  | 'gallery'
  | 'switch' 
  | 'rich-text' 
  | 'tags' 
  | 'seo-preview' 
  | 'slug-generator';

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { label: string; value: string }[];
  description?: string;
  dependsOn?: string; // e.g. for slug-generator dependsOn: 'name'
}

export interface EntitySchemaConfig {
  id: string;
  title: string;
  description: string;
  schema: z.ZodObject<any, any>;
  fields: FieldConfig[];
}

export const entitySchemas: Record<string, EntitySchemaConfig> = {
  product: {
    id: 'product',
    title: 'New Product',
    description: 'Add a new product to your catalog.',
    schema: z.object({
      name: z.string().min(3, 'Product name is required'),
      slug: z.string().min(3, 'Slug is required'),
      category: z.string().min(1, 'Category is required'),
      price: z.number().min(0, 'Price must be positive'),
      stock: z.number().min(0, 'Stock must be 0 or more'),
      status: z.enum(['active', 'draft', 'hidden']).default('active'),
      description: z.string().optional(),
      tags: z.array(z.string()).optional(),
      image: z.any().optional(),
      gallery: z.array(z.any()).optional(),
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
    }),
    fields: [
      { name: 'name', label: 'Product Name', type: 'text', placeholder: 'e.g. Premium Basmati Rice' },
      { name: 'slug', label: 'URL Slug', type: 'slug-generator', dependsOn: 'name' },
      { name: 'category', label: 'Category', type: 'select', options: [
        { label: 'Grocery Items', value: 'Grocery Items' },
        { label: 'Beverages', value: 'Beverages' },
        { label: 'Snacks', value: 'Snacks' },
      ]},
      { name: 'price', label: 'Price (₹)', type: 'number', placeholder: 'e.g. 450' },
      { name: 'stock', label: 'Stock Quantity', type: 'number', placeholder: 'e.g. 100' },
      { name: 'status', label: 'Status', type: 'select', options: [
        { label: 'Active', value: 'active' },
        { label: 'Draft', value: 'draft' },
        { label: 'Hidden', value: 'hidden' },
      ]},
      { name: 'description', label: 'Detailed Description', type: 'rich-text' },
      { name: 'tags', label: 'Product Tags', type: 'tags', placeholder: 'Press Enter to add tags' },
      { name: 'image', label: 'Primary Image', type: 'image' },
      { name: 'gallery', label: 'Product Gallery', type: 'gallery', description: 'Upload multiple product angles' },
      { name: 'seoTitle', label: 'SEO Title', type: 'text', placeholder: 'Leave empty to use Product Name' },
      { name: 'seoDescription', label: 'SEO Description', type: 'textarea', placeholder: 'Meta description for search engines' },
      { name: 'seo-preview', label: 'Search Engine Preview', type: 'seo-preview' },
    ]
  },
  category: {
    id: 'category',
    title: 'New Category',
    description: 'Create a new product taxonomy category.',
    schema: z.object({
      name: z.string().min(2, 'Category name is required'),
      description: z.string().optional(),
      active: z.boolean().default(true),
    }),
    fields: [
      { name: 'name', label: 'Category Name', type: 'text', placeholder: 'e.g. Organic Foods' },
      { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Brief description of the category' },
      { name: 'active', label: 'Active Status', type: 'switch', description: 'Make this category visible in the store' },
    ]
  },
  customer: {
    id: 'customer',
    title: 'New Customer',
    description: 'Manually add a new customer profile.',
    schema: z.object({
      name: z.string().min(3, 'Name is required'),
      email: z.string().email('Invalid email address'),
      phone: z.string().min(10, 'Valid phone number required'),
      status: z.enum(['active', 'blocked']).default('active'),
    }),
    fields: [
      { name: 'name', label: 'Full Name', type: 'text', placeholder: 'e.g. John Doe' },
      { name: 'email', label: 'Email Address', type: 'text', placeholder: 'e.g. john@example.com' },
      { name: 'phone', label: 'Phone Number', type: 'text', placeholder: 'e.g. 9876543210' },
      { name: 'status', label: 'Account Status', type: 'select', options: [
        { label: 'Active', value: 'active' },
        { label: 'Blocked', value: 'blocked' },
      ]},
    ]
  },
  order: {
    id: 'order',
    title: 'New Order',
    description: 'Manually create an order for a customer.',
    schema: z.object({
      customer: z.string().min(1, 'Customer name is required'),
      amount: z.number().min(1, 'Amount must be greater than 0'),
      status: z.enum(['Processing', 'Completed', 'Cancelled']).default('Processing'),
    }),
    fields: [
      { name: 'customer', label: 'Customer Name', type: 'text', placeholder: 'e.g. Jane Smith' },
      { name: 'amount', label: 'Total Amount (₹)', type: 'number', placeholder: 'e.g. 1500' },
      { name: 'status', label: 'Order Status', type: 'select', options: [
        { label: 'Processing', value: 'Processing' },
        { label: 'Completed', value: 'Completed' },
        { label: 'Cancelled', value: 'Cancelled' },
      ]},
    ]
  },
  coupon: {
    id: 'coupon',
    title: 'New Coupon',
    description: 'Create a discount code for marketing.',
    schema: z.object({
      code: z.string().min(4, 'Code must be at least 4 characters').toUpperCase(),
      discount: z.number().min(1, 'Discount is required').max(100),
      type: z.enum(['percentage', 'fixed']),
      validUntil: z.string().min(1, 'Expiration date is required'),
    }),
    fields: [
      { name: 'code', label: 'Coupon Code', type: 'text', placeholder: 'e.g. SUMMER50' },
      { name: 'type', label: 'Discount Type', type: 'select', options: [
        { label: 'Percentage (%)', value: 'percentage' },
        { label: 'Fixed Amount', value: 'fixed' },
      ]},
      { name: 'discount', label: 'Discount Value', type: 'number', placeholder: 'e.g. 50' },
      { name: 'validUntil', label: 'Valid Until (Date)', type: 'text', placeholder: 'YYYY-MM-DD' },
    ]
  },
  // Add placeholder schemas for the rest to ensure it works, but they are fully functional
  inventory: {
    id: 'inventory', title: 'New Inventory Log', description: 'Adjust stock levels manually.',
    schema: z.object({ product: z.string(), quantity: z.number(), reason: z.string() }),
    fields: [ { name: 'product', label: 'Product SKU', type: 'text' }, { name: 'quantity', label: 'Quantity Adjustment', type: 'number' }, { name: 'reason', label: 'Reason', type: 'textarea' } ]
  },
  marketing: {
    id: 'marketing', title: 'New Campaign', description: 'Create a new marketing email blast.',
    schema: z.object({ title: z.string(), subject: z.string(), body: z.string() }),
    fields: [ { name: 'title', label: 'Campaign Title', type: 'text' }, { name: 'subject', label: 'Email Subject', type: 'text' }, { name: 'body', label: 'Email Body', type: 'textarea' } ]
  },
  review: {
    id: 'review', title: 'Add Review', description: 'Manually add a customer review.',
    schema: z.object({ customer: z.string(), product: z.string(), rating: z.number(), text: z.string() }),
    fields: [ { name: 'customer', label: 'Customer Name', type: 'text' }, { name: 'product', label: 'Product', type: 'text' }, { name: 'rating', label: 'Rating (1-5)', type: 'number' }, { name: 'text', label: 'Review Text', type: 'textarea' } ]
  },
  social: {
    id: 'social', title: 'New Social Post', description: 'Schedule a post for social media.',
    schema: z.object({ platform: z.string(), content: z.string(), date: z.string() }),
    fields: [ { name: 'platform', label: 'Platform (FB, IG, X)', type: 'text' }, { name: 'content', label: 'Post Content', type: 'textarea' }, { name: 'date', label: 'Scheduled Date', type: 'text' } ]
  },
  hero: {
    id: 'hero', title: 'New Hero Banner', description: 'Add a new slider image to homepage.',
    schema: z.object({ title: z.string(), subtitle: z.string(), image: z.any() }),
    fields: [ { name: 'title', label: 'Heading', type: 'text' }, { name: 'subtitle', label: 'Sub-heading', type: 'text' }, { name: 'image', label: 'Banner Image', type: 'image' } ]
  },
  about: {
    id: 'about', title: 'New About Section', description: 'Add a content block to the about page.',
    schema: z.object({ heading: z.string(), content: z.string() }),
    fields: [ { name: 'heading', label: 'Heading', type: 'text' }, { name: 'content', label: 'Content Paragraph', type: 'textarea' } ]
  },
  feature: {
    id: 'feature', title: 'New Feature', description: 'Add to the Why Choose Us list.',
    schema: z.object({ icon: z.string(), title: z.string(), description: z.string() }),
    fields: [ { name: 'icon', label: 'Lucide Icon Name', type: 'text' }, { name: 'title', label: 'Feature Title', type: 'text' }, { name: 'description', label: 'Description', type: 'textarea' } ]
  },
  user: {
    id: 'user', title: 'New System User', description: 'Add a staff member to the system.',
    schema: z.object({ name: z.string(), email: z.string().email(), role: z.enum(['staff', 'editor']) }),
    fields: [ { name: 'name', label: 'Full Name', type: 'text' }, { name: 'email', label: 'Email Address', type: 'text' }, { name: 'role', label: 'Role', type: 'select', options: [{label:'Staff', value:'staff'}, {label:'Editor', value:'editor'}] } ]
  },
  admin: {
    id: 'admin', title: 'New Administrator', description: 'Grant full access to a new admin.',
    schema: z.object({ name: z.string(), email: z.string().email(), department: z.string() }),
    fields: [ { name: 'name', label: 'Admin Name', type: 'text' }, { name: 'email', label: 'Admin Email', type: 'text' }, { name: 'department', label: 'Department', type: 'text' } ]
  },
  notification: {
    id: 'notification', title: 'New System Alert', description: 'Broadcast a dashboard notification.',
    schema: z.object({ title: z.string(), message: z.string(), severity: z.enum(['info', 'warning', 'error']) }),
    fields: [ { name: 'title', label: 'Alert Title', type: 'text' }, { name: 'message', label: 'Alert Message', type: 'textarea' }, { name: 'severity', label: 'Severity Level', type: 'select', options: [{label:'Info', value:'info'}, {label:'Warning', value:'warning'}, {label:'Error', value:'error'}] } ]
  }
};
