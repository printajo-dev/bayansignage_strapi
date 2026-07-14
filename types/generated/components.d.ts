import type { Schema, Struct } from '@strapi/strapi';

export interface SignagePlaylistItem extends Struct.ComponentSchema {
  collectionName: 'components_signage_playlist_items';
  info: {
    displayName: 'Playlist Item';
    icon: 'play';
  };
  attributes: {
    durationSecs: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<10>;
    media: Schema.Attribute.Media<'images' | 'videos'> &
      Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'signage.playlist-item': SignagePlaylistItem;
    }
  }
}
