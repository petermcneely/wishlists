'use strict';

const mongodb = require('mongodb');
const slugify = require('slugify');
const TableCall = require('./tableCall');

const tcInstance = new TableCall('occasions');

const slugme = function(input) {
  return slugify(input,
      {replacement: '-', remove: /[/\\*+~.()'"!:@]/g, lower: true});
};

const createOccasion = function(userId, name, occurrence) {
  const slug = slugme(name);
  if (slug === '') {
    return Promise.resolve({error: 'That name is not allowed.'});
  } else {
    return getOccasion(slug).then((occasion) => {
      if (occasion) {
        return Promise.resolve(
            {error: 'An occasion with that name already exists.'});
      } else {
        return tcInstance.call((collection) => {
          return collection.insertOne({
            userId: new mongodb.ObjectID(userId),
            name: name,
            slug: slug,
            occurrence: new Date(occurrence),
          });
        });
      }
    });
  }
};

const getOccasions = function() {
  return tcInstance.call((collection) => {
    return collection.find({

    },
    {
      name: 1,
      occurrence: 1,
      slug: 1,
    }).toArray();
  });
};

const getOccasion = function(slug) {
  return tcInstance.call((collection) => {
    return collection.findOne({
      slug: slug,
    });
  });
};

const updateOccasionHelper = function(query, where) {
  return tcInstance.call((collection) => {
    where.slug = slugme(where.name);
    return collection.updateOne({
      slug: query.slug,
      userId: new mongodb.ObjectID(query.userId),
    },
    {
      $set: where,
    });
  });
};

const updateOccasion = function(query, where) {
  const slug = slugme(where.name);
  if (slug === '') {
    return Promise.resolve({error: 'That name is not allowed.'});
  } else if (slug !== query.slug) {
    return getOccasion(slug).then((occasion) => {
      if (occasion) {
        return Promise.resolve(
            {error: 'An occasion with that name already exists.'});
      } else {
        return updateOccasionHelper(query, where);
      }
    });
  } else {
    return updateOccasionHelper(query, where);
  }
};

const deleteOccasion = function(query) {
  return tcInstance.call((collection) => {
    return collection.deleteOne({
      slug: query.slug,
      userId: new mongodb.ObjectID(query.userId),
    });
  });
};

const createOccasionShares = function(occasionSlug, emails) {
  return tcInstance.call((collection) => {
    return collection.updateOne({
      slug: occasionSlug,
    },
    {
      $addToSet: {
        shares: {
          $each: emails,
        },
      },
    });
  });
};

const getOccasionShare = function(occasionSlug, email) {
  return tcInstance.call((collection) => {
    return collection.findOne({
      slug: occasionSlug,
      shares: email,
    },
    {
      projection: {
        'shares.$': 1,
        'slug': 1,
      },
    });
  });
};

const deleteOccasionShare = function(occasionSlug, email) {
  return tcInstance.call((collection) => {
    return collection.updateOne({
      slug: occasionSlug,
    },
    {
      $pull: {
        shares: email,
      },
    });
  });
};

const createWishlist = function(userId, name, occasionSlug) {
  const slug = slugme(name);
  if (slug === '') {
    return Promise.resolve({error: 'That name is not allowed.'});
  } else {
    return getWishlist(occasionSlug, slug).then((occasion) => {
      if (occasion && occasion.wishlists && occasion.wishlists.length) {
        return Promise.resolve(
            {error: 'A wishlist with that name already exists.'});
      } else {
        return tcInstance.call((collection) => {
          return collection.updateOne({
            slug: occasionSlug,
          },
          {
            $addToSet: {
              wishlists: {
                name: name,
                slug: slug,
                userId: new mongodb.ObjectID(userId),
              },
            },
          });
        });
      }
    });
  }
};

const getWishlists = function(occasionSlug) {
  return tcInstance.call((collection) => {
    return collection.findOne({
      slug: occasionSlug,
    },
    {
      projection: {
        wishlists: 1,
        slug: 1,
      },
    });
  });
};

const getWishlist = function(occasionSlug, wishlistSlug) {
  return tcInstance.call((collection) => {
    return collection.findOne({
      slug: occasionSlug,
    },
    {
      projection: {
        wishlists: {
          $elemMatch: {
            slug: wishlistSlug,
          },
        },
        shares: 1,
        userId: 1,
        slug: 1,
      },
    });
  });
};

const updateWishlist = function(occasionSlug, userId, wishlistSlug, newName) {
  const slug = slugme(newName);
  if (slug === '') {
    return Promise.resolve({error: 'That name is not allowed.'});
  } else if (slug !== wishlistSlug) {
    return getWishlist(occasionSlug, slug).then((occasion) => {
      if (occasion && occasion.wishlists) {
        return Promise.resolve(
            {error: 'A wishlist with that name already exists.'});
      } else {
        return tcInstance.call((collection) => {
          return collection.updateOne({
            slug: occasionSlug,
            wishlists: {
              $elemMatch: {
                userId: new mongodb.ObjectID(userId),
                slug: wishlistSlug,
              },
            },
          },
          {
            $set: {
              'wishlists.$.name': newName,
              'wishlists.$.slug': slug,
            },
          });
        });
      }
    });
  } else {
    return Promise.resolve();
  }
};

const deleteWishlist = function(occasionSlug, userId, slug) {
  return tcInstance.call((collection) => {
    return collection.updateOne({
      'slug': occasionSlug,
      'wishlists.userId': new mongodb.ObjectID(userId),
    },
    {
      $pull: {
        wishlists: {
          slug: slug,
        },
      },
    });
  });
};

const createItem = function(occasionSlug, wishlistSlug, name, comments, link) {
  const slug = slugme(name);
  if (slug === '') {
    return Promise.resolve({error: 'That name is not allowed.'});
  } else {
    return getItem(occasionSlug, wishlistSlug, slug).then((item) => {
      if (item) {
        return Promise.resolve(
            {error: 'An item with that name already exists.'});
      } else {
        return tcInstance.call((collection) => {
          return collection.updateOne({
            'slug': occasionSlug,
            'wishlists.slug': wishlistSlug,
          },
          {
            $addToSet: {
              'wishlists.$.items': {
                name: name,
                comments: comments,
                link: link,
                slug: slug,
              },
            },
          });
        });
      }
    });
  }
};

const getItem = function(occasionSlug, wishlistSlug, itemSlug) {
  return tcInstance.call((collection) => {
    return collection.findOne({
      'slug': occasionSlug,
      'wishlists.slug': wishlistSlug,
    },
    {
      projection: {
        wishlists: {
          $elemMatch: {
            slug: wishlistSlug,
          },
        },
        slug: 1,
      },
    }).then((occasion) => {
      if (occasion && occasion.wishlists &&
        occasion.wishlists.length && occasion.wishlists[0].items) {
        for (let i = 0; i < occasion.wishlists[0].items.length; ++i) {
          if (occasion.wishlists[0].items[i].slug === itemSlug) {
            return Promise.resolve({
              item: occasion.wishlists[0].items[i],
              userId: occasion.wishlists[0].userId,
              occasion: {
                id: occasion._id,
                slug: occasion.slug,
              },
            });
          }
        }
      }
      return Promise.resolve();
    });
  });
};

const updateItemHelper = function(
    occasionSlug, wishlistSlug, itemSlug, updateObject) {
  return tcInstance.call((collection) => {
    updateObject.slug = slugme(updateObject.name);
    return collection.updateOne({
      slug: occasionSlug,
      wishlists: {
        $elemMatch: {
          'slug': wishlistSlug,
          'items.slug': itemSlug,
        },
      },
    },
    {
      $set: {
        'wishlists.$[outer].items.$[inner]': updateObject,
      },
    },
    {
      arrayFilters: [
        {'outer.slug': wishlistSlug},
        {'inner.slug': itemSlug},
      ],
    });
  });
};

const updateItem = function(
    occasionSlug, wishlistSlug, itemSlug, updateObject) {
  const slug = slugme(updateObject.name);
  if (slug === '') {
    return Promise.resolve({error: 'That name is not allowed.'});
  } else if (slug !== itemSlug) {
    return getItem(occasionSlug, wishlistSlug, slug).then((item) => {
      if (item) {
        return Promise.resolve(
            {error: 'An item with that name already exists.'});
      } else {
        return updateItemHelper(
            occasionSlug, wishlistSlug, itemSlug, updateObject);
      }
    });
  } else {
    return updateItemHelper(occasionSlug, wishlistSlug, itemSlug, updateObject);
  }
};

const deleteItem = function(occasionSlug, wishlistSlug, itemSlug) {
  return tcInstance.call((collection) => {
    return collection.updateOne({
      slug: occasionSlug,
      wishlists: {
        $elemMatch: {
          slug: wishlistSlug,
        },
      },
    },
    {
      $pull: {
        'wishlists.$[outer].items': {
          slug: itemSlug,
        },
      },
    },
    {
      arrayFilters: [
        {'outer.slug': wishlistSlug},
      ],
    });
  });
};

const claimItem = function(occasionSlug, wishlistSlug, itemSlug, userId) {
  return tcInstance.call((collection) => {
    return collection.updateOne({
      slug: occasionSlug,
      wishlists: {
        $elemMatch: {
          'slug': wishlistSlug,
          'items.slug': itemSlug,
        },
      },
    },
    {
      $set: {
        'wishlists.$[outer].items.$[inner].claimed': {
          by: new mongodb.ObjectID(userId),
          at: new Date(),
        },
      },
    },
    {
      arrayFilters: [
        {'outer.slug': wishlistSlug},
        {'inner.slug': itemSlug},
      ],
    });
  });
};

const unclaimItem = function(occasionSlug, wishlistSlug, itemSlug, userId) {
  return tcInstance.call((collection) => {
    return collection.updateOne({
      slug: occasionSlug,
      wishlists: {
        $elemMatch: {
          slug: wishlistSlug,
          items: {
            $elemMatch: {
              'slug': itemSlug,
              'claimed.by': new mongodb.ObjectID(userId),
            },
          },
        },
      },
    },
    {
      $set: {
        'wishlists.$[outer].items.$[inner].claimed': null,
      },
    },
    {
      arrayFilters: [
        {'outer.slug': wishlistSlug},
        {'inner.slug': itemSlug},
      ],
    });
  });
};

const createComment = (occasionSlug, wishlistSlug, userId, body, showOwner) => {
  return tcInstance.call((collection) => {
    return collection.updateOne({
      'slug': occasionSlug,
      'wishlists.slug': wishlistSlug,
    },
    {
      $addToSet: {
        'wishlists.$.comments': {
          _id: new mongodb.ObjectID(),
          body: body,
          showOwner: showOwner,
          userId: new mongodb.ObjectID(userId),
          createdAt: new Date(),
        },
      },
    });
  });
};

const updateComment = (
    occasionSlug,
    wishlistSlug,
    commentOid,
    updateObject) => {
  return tcInstance.call((collection) => {
    return collection.updateOne({
      slug: occasionSlug,
      wishlists: {
        $elemMatch: {
          'slug': wishlistSlug,
          'comments._id': new mongodb.ObjectID(commentOid),
        },
      },
    },
    {
      $set: {
        'wishlists.$[outer].comments.$[inner].body': updateObject.body,
        'wishlists.$[outer].comments.$[inner].showOwner': updateObject.showOwner,
        'wishlists.$[outer].comments.$[inner].modifiedAt': updateObject.modifiedAt,
      },
    },
    {
      arrayFilters: [
        {'outer.slug': wishlistSlug},
        {'inner._id': new mongodb.ObjectID(commentOid)},
      ],
    });
  });
};

const deleteComment = (occasionSlug, wishlistSlug, commentOid) => {
  return tcInstance.call((collection) => {
    return collection.updateOne({
      slug: occasionSlug,
      wishlists: {
        $elemMatch: {
          slug: wishlistSlug,
        },
      },
    },
    {
      $pull: {
        'wishlists.$[outer].comments': {
          '_id': new mongodb.ObjectID(commentOid),
        },
      },
    },
    {
      arrayFilters: [
        {'outer.slug': wishlistSlug},
      ],
    });
  });
};

module.exports = {
  createOccasion: createOccasion,
  getOccasions: getOccasions,
  getOccasion: getOccasion,
  updateOccasion: updateOccasion,
  deleteOccasion: deleteOccasion,
  createOccasionShares: createOccasionShares,
  getOccasionShare: getOccasionShare,
  deleteOccasionShare: deleteOccasionShare,
  createWishlist: createWishlist,
  getWishlists: getWishlists,
  getWishlist: getWishlist,
  updateWishlist: updateWishlist,
  deleteWishlist: deleteWishlist,
  createItem: createItem,
  getItem: getItem,
  updateItem: updateItem,
  deleteItem: deleteItem,
  claimItem: claimItem,
  unclaimItem: unclaimItem,
  createComment: createComment,
  updateComment: updateComment,
  deleteComment: deleteComment,
}
;
