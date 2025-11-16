const schema = {
  collectionName: 'posts',
  info: {
    singularName: 'post',
    pluralName: 'posts',
    displayName: 'Post',
    description: 'Blog posts',
  },
  options: {
    draftAndPublish: true,
  },
  attributes: {
    title: {
      type: 'string',
      required: true,
    },
    content: {
      type: 'richtext',
    },
  },
};

export default schema;
