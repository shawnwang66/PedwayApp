'use strict';
const {auth} = require('./authController');
const roles = require('../../src/roles');

const mongoose = require('mongoose');
const PedwaySection = mongoose.model('section');
const util = require('./util');

/**
 * Returns all pedway sections
 *
 * @param {Object} req the request object
 * @param {Object} res the response object
 */
exports.getAll = util.getAllData(PedwaySection);

/**
 * Creates a pedway section
 *
 * @param {Object} req the request object
 * @param {Object} res the response object
 */
exports.create = function(req, res) {
  auth(req, roles.ADMIN)
      .then(() => {
        const section = new PedwaySection(req.body);
        section.save(function(err, section) {
          if (err) {
            res.send(err);
          } else {
            res.json(section);
          }
        });
      })
      .catch((err) => res.status(401).send(err));
};

/**
 * Gets a pedway section by the section id.
 * Note that this is the OBJECTID associated with each section, and not the
 * autogenerated _id.
 *
 * @param {Object} req the request object
 * @param {Object} res the response object
 */
exports.getById = function(req, res) {
  const sectionId = parseInt(req.params.sectionId, 10);
  if (isNaN(sectionId)) {
    res.status(400).send({message: 'Non-integer section id sent'});
    return;
  }

  PedwaySection.findOne(
      {'properties.OBJECTID': sectionId}, function(err, section) {
        if (err) {
          res.send(err);
        } else {
          res.json(section);
        }
      });
};

/**
 * Updates a pedway section
 *
 * @param {Object} req the request object
 * @param {Object} res the response object
 */
exports.update = function(req, res) {
  auth(req, roles.ADMIN)
      .then(() => {
        const sectionId = parseInt(req.params.sectionId, 10);
        if (isNaN(sectionId)) {
          res.status(400).send({message: 'Non-integer section id sent'});
          return;
        }

        PedwaySection.findOneAndUpdate(
            {'properties.OBJECTID': sectionId}, req.body, {new: true},
            function(err, section) {
              if (err) {
                res.send(err);
              } else {
                res.json(section);
              }
            });
      })
      .catch((err) => res.status(401).send(err));
};
